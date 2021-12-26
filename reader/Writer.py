import threading
from typing import List

from pirc522 import RFID


class WriteHelper:
    def __init__(self):
        self.writeQueue: List[List[int]] = []
        self.generate_queue()
        self.processed_cards: List[str] = []
        self.currentCard: str = ""
        self.currentCardAction: int = 0
        self.currentWriteQueueIndex: int = -1
        self.get_next_write_card()

    def get_suit_name(self) -> str:
        real_index = self.writeQueue[self.currentWriteQueueIndex][1]
        return ["hearts", "diamonds", "spades", "clubs"][real_index]

    def get_rank_name(self) -> str:
        real_index = self.writeQueue[self.currentWriteQueueIndex][3]
        return ["A", "2", "3", "4", "5", "6", "7", "8", "9", "10", "J", "Q", "K"][real_index]

    def get_next_write_card(self) -> List[int]:
        self.currentWriteQueueIndex += 1
        print("\nnext Card: " + self.get_suit_name() + "->" + self.get_rank_name())
        return self.writeQueue[self.currentWriteQueueIndex - 1]

    def got_card(self, writer, uid: bytes) -> None:
        # will use Blockaddress 8, 9, 10 -> meta: 11 [Sector 3]
        # will change auth from default

        if str(uid) not in self.processed_cards:
            if not self.currentCard == str(uid):
                print("Got Card with UID: " + str(uid[0]) + "," + str(uid[1]) + "," + str(uid[2]) + "," + str(uid[3]))
                self.currentCard = str(uid)
                self.currentCardAction = 0

            self.execute_card_action(uid, writer)

    def execute_card_action(self, uid, writer) -> None:
        if self.currentCardAction == 0:
            self.write_action_auth_a(uid, writer)
        elif self.currentCardAction == 1:
            self.write_action_auth_b(uid, writer)
        elif self.currentCardAction == 2:
            self.write_action_data(uid, writer)
        else:
            print("kaputt\n")
            self.processing_finished_or_failed(uid)

    def processing_finished_or_failed(self, uid):
        self.processed_cards.append(str(uid))

    def write_action_data(self, uid, writer) -> None:
        if self.auth_b(writer, uid):
            print("has auth b")
            if not self.rewrite(writer, 8, self.get_next_write_card()):
                self.processing_finished_or_failed(uid)
            else:
                print("!!!write failed!!!" + str(self.currentCardAction))
                self.processing_finished_or_failed(uid)
        else:
            print("not auth b")
        self.currentCardAction = 3

    def write_action_auth_b(self, uid, writer) -> None:
        if self.auth_a(writer, uid):
            print("has auth a")
            print("rewrite AuthB")
            if not self.rewrite(writer, 11, [0x33, 0xEA, 0x50, 0x57, 0x20, 0x23,
                                             None, None, None, None,
                                             0x33, 0xEA, 0x50, 0x57, 0x20, 0x23]):
                print("updated AuthB")
            else:
                print("!!!write failed!!!")
                self.processing_finished_or_failed(uid)
        else:
            print("not auth a")
        self.currentCardAction = 2

    def write_action_auth_a(self, uid, writer) -> None:
        if self.auth_default(writer, uid):
            print("has default auth")
            print("rewrite AuthA")
            if not self.rewrite(writer, 11, [0x33, 0xEA, 0x50, 0x57, 0x20, 0x23]):
                print("updated AuthA")
            else:
                print("!!!write failed!!!")
                self.processing_finished_or_failed(uid)
        else:
            print("not default auth")
        self.currentCardAction = 1

    def generate_queue(self) -> None:
        for suitIndex in range(4):
            for rankIndex in range(13):
                self.writeQueue.append(self.create_bytes(suitIndex, rankIndex))

    def create_bytes(self, suit: int, rank: int) -> List[int]:
        return [0x25, suit, 0x52, rank]

    def rewrite(self, writer, block_address, new_bytes: List[int]) -> bool:
        (error, data) = writer.read(block_address)
        if not error:
            for i in range(len(new_bytes)):
                if new_bytes[i] is not None:
                    data[i] = new_bytes[i]

            error = writer.write(block_address, data)
        return error

    def auth_default(self, writer, uid) -> bool:
        return not writer.card_auth(writer.auth_a, 11, [0xFF, 0xFF, 0xFF, 0xFF, 0xFF, 0xFF], uid)

    def auth_a(self, writer, uid) -> bool:
        return not writer.card_auth(writer.auth_a, 11, [0x33, 0xEA, 0x50, 0x57, 0x20, 0x23], uid)

    def auth_b(self, writer, uid) -> bool:
        return not writer.card_auth(writer.auth_b, 11, [0x33, 0xEA, 0x50, 0x57, 0x20, 0x23], uid)


def card_writer():
    writer = RFID(bus=3)
    print("Start waiting for cards")
    helper = WriteHelper()
    try:
        while True:
            writer.wait_for_tag()
            (error, data) = writer.request()
            if not error:
                (error, uid) = writer.anticoll()
                if not error:
                    if not writer.select_tag(uid):
                        helper.got_card(writer, uid)

    finally:
        # Calls GPIO cleanup
        writer.cleanup()


def main():
    """
    Main program function
    """
    t1 = threading.Thread(target=card_writer)

    t1.start()

    t1.join()


if __name__ == "__main__":
    main()

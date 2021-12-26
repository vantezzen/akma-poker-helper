from typing import List

from Card import Card
from mqtt.MqttPublisherCard import MqttPublisherCard


class ReadHelper:
    def __init__(self, publisher: MqttPublisherCard):
        self.processed_cards: List[str] = []
        self.publisher = publisher

    def get_suit_name(self, data: List[int]) -> str:
        real_index = data[1]
        return Card.allowed_suits[real_index]

    def get_rank_name(self, data: List[int]) -> str:
        real_index = data[3]
        return Card.allowed_ranks[real_index]

    def got_card(self, reader, uid: List[int]) -> None:
        # will use Blockaddress 8, 9, 10 -> meta: 11 [Sector 3]

        if str(uid) not in self.processed_cards:
            if self.auth_a(reader, uid):
                (error, data) = reader.read(8)
                if not error:
                    self.publisher.write_card(Card(self.get_suit_name(data), self.get_rank_name(data)))

                else:
                    print("Read Data failed: " + data)
            else:
                print("auth failed!")
            self.processing_finished_or_failed(uid)

    def processing_finished_or_failed(self, uid: List[int]):
        self.processed_cards.append(str(uid))

    def auth_a(self, reader, uid) -> bool:
        return not reader.card_auth(reader.auth_a, 11, [0x33, 0xEA, 0x50, 0x57, 0x20, 0x23], uid)

    def auth_b(self, reader, uid) -> bool:
        return not reader.card_auth(reader.auth_b, 11, [0x33, 0xEA, 0x50, 0x57, 0x20, 0x23], uid)

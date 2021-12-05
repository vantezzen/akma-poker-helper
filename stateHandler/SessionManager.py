from typing import List

from Card import Card
from mqtt.MqttPublisherState import MqttPublisherState
from sessionDTO import SessionDTO


class SessionManager:
    def __init__(self, mqtt_publisher_state: MqttPublisherState):
        self.playerAmount: int = 1
        self.__currentSession: SessionDTO = {
            "desk": [],
            "hands": {},
            "nextCard": 0,
            "smallBlind": 1,
            "bigBlind": 2
        }
        self.__mqtt_publisher = mqtt_publisher_state
        self.__cardAgenda: List[int] = self.__compute_agenda()
        self.__cardAgendaIndex: int = 0
        self.start_round(1)

    def add_card(self, new_card: Card):
        next_card = self.__currentSession["nextCard"]
        if next_card == 0:
            self.__currentSession['desk'].append(new_card)
        elif 0 < next_card < self.playerAmount:
            self.__currentSession['hands'][str(next_card)].append(new_card)
        else:
            raise RuntimeError("the current session is finished!")

        self.__currentSession["nextCard"] = self.__get_new_next_card()
        self.__on_update()

    def __get_new_next_card(self) -> int:
        if self.__cardAgendaIndex > len(self.__cardAgenda):
            return -1

        self.__cardAgendaIndex += 1
        return self.__cardAgenda[self.__cardAgendaIndex]

    def get_session(self) -> SessionDTO:
        return self.__currentSession

    def __compute_agenda(self) -> List[int]:
        agenda: List[int] = []

        for i in range(1, self.playerAmount + 1):
            agenda.append(i)
            agenda.append(i)

        agenda.append(0)
        agenda.append(0)
        agenda.append(0)
        agenda.append(0)
        agenda.append(0)

        return agenda

    def revert_last(self):
        self.__cardAgendaIndex -= 1
        self.__on_update()

    def __on_update(self):
        self.__mqtt_publisher.write_state(self.__currentSession)

    def start_round(self, player_amount: int):
        if self.playerAmount != player_amount:
            self.__currentSession: SessionDTO = {
                "desk": [],
                "hands": {},
                "nextCard": 0,
                "smallBlind": 1,
                "bigBlind": 2
            }
        else:
            self.__currentSession: SessionDTO = {
                "desk": [],
                "hands": {},
                "nextCard": 0,
                "smallBlind": (self.__currentSession["smallBlind"] % self.playerAmount) + 1,
                "bigBlind": (self.__currentSession["bigBlind"] % self.playerAmount) + 1
            }
        self.playerAmount: int = player_amount

        self.__on_update()

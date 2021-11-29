from typing import List
from card import Card
from sessionDTO import SessionDTO


class SessionManager:
    def __init__(self, player_amount: int):
        self.currentSession: SessionDTO = {
            "desk": [],
            "hands": {},
            "nextCard": 0
        }
        self.playerAmount = player_amount
        self.cardAgenda: List[int] = self.compute_agenda()
        self.cardAgendaIndex: int = 0

    def add_card(self, new_card: Card):
        next_card = self.currentSession["nextCard"]
        if next_card == 0:
            self.currentSession['desk'].append(new_card)
        elif 0 < next_card < self.playerAmount:
            self.currentSession['hands'][str(next_card)].append(new_card)
        else:
            raise RuntimeError("the current session is finished!")

        self.currentSession["nextCard"] = self.__get_new_next_card()

    def __get_new_next_card(self) -> int:
        if self.cardAgendaIndex > len(self.cardAgenda):
            return -1

        self.cardAgendaIndex += 1
        return self.cardAgenda[self.cardAgendaIndex]

    def get_session(self) -> SessionDTO:
        return self.currentSession

    def compute_agenda(self) -> List[int]:
        agenda: List[int] = []

        for i in range(1, self.playerAmount):
            agenda.append(i)
            agenda.append(i)

        agenda.append(0)
        agenda.append(0)
        agenda.append(0)
        agenda.append(0)
        agenda.append(0)

        return agenda

from typing import List, TypedDict, Mapping
from card import Card


class SessionDTO(TypedDict):
    desk: List[Card]
    hands: Mapping[str, List[Card]]
    nextCard: int

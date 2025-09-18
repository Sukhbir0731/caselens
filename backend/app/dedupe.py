import re
from datasketch import MinHash, MinHashLSH


TOKEN_RE = re.compile(r"[A-Za-z0-9]{3,}")


def _tokens(text: str):
    return TOKEN_RE.findall(text.lower())

def minhash_signature(text: str, num_perm: int = 64) -> MinHash:
    mh = MinHash(num_perm=num_perm)
    for t in set(_tokens(text)):
        mh.update(t.encode("utf8"))
    return mh

class DeDupeIndex:
    def __init__(self, threshold: float = 0.85, num_perm: int = 64):
        self.lsh = MinHashLSH(threshold=threshold, num_perm=num_perm)
        self._store = {}
        self.num_perm = num_perm

    def add(self, key: str, text: str):
        mh = minhash_signature(text, self.num_perm)
        self.lsh.insert(key, mh)
        self._store[key] = mh
        
    def is_duplicate(self, text: str):
        mh = minhash_signature(text, self.num_perm)
        cands = self.lsh.query(mh)
        return len(cands) > 0, cands
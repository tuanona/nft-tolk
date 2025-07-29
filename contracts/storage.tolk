struct RoyaltyParams  {
    numerator: uint16
    denominator: uint16
    rolaytyAdd: address
}

struct NftCollStorage  {
    adminAdd: address
    nextItemIdex: uint64
    content: Cell<CollectionContent>
    nftItemCode: cell
    royaltyParams: Cell<RoyaltyParams>
}

struct CollectionContent {
    collMetadata: cell
    commonContent: Cell
}

struct NftItemStorageNotInitialized {
    itemIndex: uint64
    collAdd: address
}

fun NftCollStorage.load() {
    return NftCollStorage.fromCell(contract.getData())
}

fun NftCollStorage.save(self) {
    contract.setData(self.toCell())
}


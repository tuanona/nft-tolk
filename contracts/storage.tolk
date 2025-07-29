struct NftCollectionStorage {
    adminAdress: address
    nextItemIdex: uint64
    content: Cell<CollectionContent>
    nftItemCode: cell
    royaltyParams: Cell<RoyalParams>
}

struct CollectionCotent {
    collectionMetadata: cell
    commonContent: Cell<SnakeString>
}

struct NftItemStorage {
    itemIndex: uint64
    collectionAddress: address
    ownerAddress: address
    content: Cell<SnakeString>
}

struct RoyaltyParams {
    numerator: uint16
    denominator: uint16
    royaltyAddress: address
}

struct NftItemStorageNotInitialized {
    itemIndex: uint64
    collectionAddress: address
}

fun NftCollectionStorage.load(): NftCollectionStorage {
    return NftCollectionStorage.fromCell(contract.getData())
}

fun NftCollectionStorage.save(self) {
    contract.setData(self.toCell());
}


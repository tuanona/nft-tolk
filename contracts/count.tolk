tolk 1.0

import "message"

struct Storage {
    id: uint32
    counter: uint32
}

fun Storage.load() {
    return Storage.fromCell(contract.getData())
}

fun Storage.save(self) {
    return contract.setData(self.toC)
}


type AllowedMessage = IncreaseCounter | ResetCounter;

fun onInternalMessage(in: InMessage) {
    val msg = lazy AllowedMessage.fromSlice(in.body);

    match (msg) {
        IncreaseCounter => {
            var storage = lazy Storage.load();

            storage.counter += msg.increaseBy;
            storage.save();
        }
        ResetCounter => {
            var storage = lazy Storage.load();

            storage.counter = 0;
            storage.save();
        }
        else => {
            assert (in.body.isEmpty()) throw 5;
        }
    }
}

fun onBouncedMessage(in: InMessageBounced) {
    assert (in.bouncedBody.isEmpty) throw 5;
}

get fun curCounter() {
    val storage = lazy Storage.load();
    return storage.counter;
}

get fun thisIsID() {
    val storage = lazy Storage.load();
    return storage.id
}
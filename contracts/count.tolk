tolk 1.0

import "counter"
import "@stdlib/gas-payments"
import "@stdlib/common"

struct Counter {
    id: uint32
    count: uint32
}


struct (0x1) AddingNumber {
    queryId: uint32
    add: uint32
}

struct (0xf) ResetNumber {
    queryId: uint32
}

fun Counter.load(): void {
    return Storage.fromCell(contract.getData())
    
}

fun Counter.save(self)  {
    return contract.setData(self.toCell())
}
type AllowMsg = 
    | AddingNumber 
    | ResetNumber

fun onInternalMessage(in: InMessage) {
    val msg = lazy AllowMsg.fromSlice(in.body);

    match (msg) {
        AddingNumber => {
            var storage = lazy Counter.load();
            storage.count += msg.add;
            storage.save();
        }
        ResetNumber => {
            var storage = lazy Counter.load();
            storage.count = 0;
            storage.save();
        }
        else => {
            assert (in.body.isEmpty()) throw 5;
        }
    }
}

get fun curCounter() {
    val num = lazy Storage.load();
    return num.count;
}
// the struct uses a 32-bit opcode prefix for message identification
struct (0x7e8764ef) IncreaseCounter {
    queryId: uint64  // query id, typically included in messages
    increaseBy: uint32 
}
struct (0x3a752f06) ResetCounter {
    queryId: uint64
}
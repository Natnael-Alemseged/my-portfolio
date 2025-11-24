import Supermemory from 'supermemory';

const supermemory = new Supermemory({ apiKey: 'test' });
console.log('--- Keys ---');
Object.keys(supermemory).forEach(k => console.log(k));

if ((supermemory as any).memories) {
    console.log('--- Memories Keys ---');
    // Check prototype if instance keys are empty (methods might be on prototype)
    let proto = Object.getPrototypeOf((supermemory as any).memories);
    Object.getOwnPropertyNames(proto).forEach(k => console.log(k));
    // Also check instance keys
    Object.keys((supermemory as any).memories).forEach(k => console.log(k));
}

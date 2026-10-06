import EventEmitter from 'events';

const eventEmitter = new EventEmitter();

export function emitEvent(type, data) {
  eventEmitter.emit('app_event', { type, data });
}

export function subscribeToEvents(callback) {
  eventEmitter.on('app_event', callback);
  return () => eventEmitter.off('app_event', callback);
}

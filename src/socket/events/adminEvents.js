
let ioInstance = null;

function setIoInstance(io) {
  ioInstance = io;
}

function getIoInstance() {
  if (!ioInstance) {
    throw new Error("IO instance has not been set.");
  }
  return ioInstance;
}

export {
  setIoInstance,
  getIoInstance,
};
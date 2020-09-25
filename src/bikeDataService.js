import { from, fromEvent } from "rxjs";
import { map, switchMap } from "rxjs/operators";

const observe = async (serviceId, characteristicId) => {
  let options = {
    filters: [{ services: [serviceId] }],
  };

  const device = await navigator.bluetooth.requestDevice(options);
  const server = await device.gatt.connect();
  const service = await server.getPrimaryService(serviceId);
  const characteristic = await service.getCharacteristic(characteristicId);

  await characteristic.startNotifications();
  return fromEvent(characteristic, "characteristicvaluechanged");
};

const parseBikeData = (value) => {
  const result = {};

  result.flags = value.getUint16(0, true).toString(2);
  result.speed = value.getUint16(2, true) / 100;
  result.cadence = value.getUint16(4, true) / 2;
  result.power = value.getInt16(6, true);
  result.heartRate = value.getUint8(8, true);

  return result;
};

export const connect = () => {
  return from(observe("fitness_machine", "indoor_bike_data")).pipe(
    switchMap((sub) => sub),
    map((e) => e.target.value),
    map((raw) => parseBikeData(raw))
  );
};
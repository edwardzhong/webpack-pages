import { hexStringToArrayBuffer, dataViewToHexString } from './common/util';
import '../css/base.css';
import '../scss/index.scss';

const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');

document.getElementsByClassName('btn')[0].onclick = async () => {
    const serviceID = '0000eee0-0000-1000-8000-00805f9b34fb';
    const readCharID = '0000eee2-0000-1000-8000-00805f9b34fb';
    const writeCharID = '0000eee1-0000-1000-8000-00805f9b34fb';
    const traceCharID = '0000eee3-0000-1000-8000-00805f9b34fb';
    const gestureCommond = 'aa553300';
    const traceCommond = 'aa553200';

    try {
        const device = await navigator.bluetooth.requestDevice({
            filters: [{ name: 'MagicPen' }],
            optionalServices: [serviceID],
        });

        device.ongattserverdisconnected = () => {
            alert('蓝牙设备已断开');
        };

        const server = await device.gatt.connect();

        if (device.gatt.connected) {
            alert('蓝牙设备已连接');
        }

        // 获取服务
        const service = await server.getPrimaryService(serviceID);
        // // 读取手势识别频道
        // const receiver = await service.getCharacteristic(readCharID);
        // await receiver.startNotifications();
        // receiver.oncharacteristicvaluechanged = e => {
        // 	const val = dataViewToHexString(e.target.value);
        // 	const i = [
        // 		'55aa0100',
        // 		'55aa0200',
        // 		'55aa5200',
        // 		'55aa5100',
        // 		'55aa5000',
        // 		'55aa4f00',
        // 		'55aac000',
        // 		'55aab000',
        // 	].indexOf(val);
        // 	const actions = ['单击', '双击', '向上', '向下', '向左', '向右', '顺时针', '逆时针'];
        // 	console.log(actions[i] || 'action not exist');
        // };

        // 陀螺仪数据上报频道
        const tracer = await service.getCharacteristic(traceCharID);
        await tracer.startNotifications();
        tracer.oncharacteristicvaluechanged = e => {
            const val = dataViewToHexString(e.target.value);
            const dx = parseInt(val.slice(0, 4), 16);
            const dy = parseInt(val.slice(4, 8), 16);
            const dz = parseInt(val.slice(8, 12), 16);
            const ax = parseInt(val.slice(12, 16), 16);
            const ay = parseInt(val.slice(16, 20, 16));
            const az = parseInt(val.slice(20), 16);
            console.log('角速度', ax, ay, az, '加速度', dx, dy, dz);
        };

        // 写命令频道
        const controller = await service.getCharacteristic(writeCharID);
        controller.writeValue(hexStringToArrayBuffer(gestureCommond));
    } catch (err) {
        console.log(err.message);
    }
};

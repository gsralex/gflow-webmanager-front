import moment from "moment";
export default class StatusLabel {

    static getUseTime(startTime, endTime) {
        if (endTime > 0 &&
            startTime > 0 && endTime > startTime) {
            var useTime = endTime - startTime;
            if (useTime > 1000 * 60) {//大于1分钟
                console.log(useTime);
                return (useTime / (1000 * 60)).toFixed(0) + "分" + ((useTime/1000).toFixed(0) %  60) + "秒";
            } else {
                return (useTime / 1000).toFixed(1) + "秒";
            }
        }
        return "";
    }

    static formatTime(unixTime) {
        return moment(unixTime).format('YYYY-MM-DD HH:mm:ss')
    }

    static getJobGroupStatus(status) {
        switch (status) {
            case 1: {
                return "正在执行";
            }
            case 2: {
                return "暂停";
            }
            case 3: {
                return "停止";
            }
            case 4: {
                return "完成";
            }
            default: {
                return "";
            }
        }
    }

    static getJobStatus(status) {
        switch (status) {
            case 1: {
                return "发送失败";
            }
            case 2: {
                return "发送失败";
            }
            case 3: {
                return "执行成功";
            }
            case 4: {
                return "执行失败";
            }
            default: {
                return "";
            }
        }
    }
}
export default class Labels {


    static getTimeType(timeType, time, interval) {
        switch (timeType) {
            case 1: {
                //timer
                return time + " 执行";
            }
            case 2: {
                //interval
                if (interval > 1000 * 60 * 60) {//1 hour
                    return interval / (1000 * 60 * 60) + "小时";
                } else if (interval > 1000 * 60) {
                    return interval / (1000 * 60) + "分钟";
                } else {
                    return interval / 1000 + "秒";
                }
            }
            default: {
                return "";
            }
        }
    }

}
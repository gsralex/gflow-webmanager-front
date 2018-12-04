export default class RequestUtils {

    static getParameter(search, key) {
        //?asdadsd=23123asdasdas
        var r = "";
        if (search == null) {
            return r;
        }
        if (key == null) {
            return r;
        }
        var index = search.indexOf("?");
        if (index != -1) {
            search = search.substr(index + 1, search.length);
            var array = search.split("&");
            for (var i in array) {
                var kv = array[i].split("=");
                if (kv[0].toLowerCase() == key.toLowerCase()) {
                    return kv[1];
                }
            }
        }
        return r;
    }

}
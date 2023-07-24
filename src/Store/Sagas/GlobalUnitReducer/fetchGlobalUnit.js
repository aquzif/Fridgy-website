import NetworkUtils from "@/Utils/NetworkUtils";


function* fetchGlobalUnit() {
    if(!NetworkUtils.isOnline()) return;



}

export default fetchGlobalUnit;

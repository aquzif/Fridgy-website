

export default class SearchUtils{

    static filterBySearchTerm(data, searchTerm, columns){

        if(data.length === 0) return data;
        console.log(data);
        return data.filter((row) => {
            for(let i = 0; i < columns.length; i++){
                let cell = row[columns[i].name];

                if(typeof cell === 'object'){
                    cell = cell.props.children;
                }

                let searchVal = '';
                if(columns[i].searchValue){
                    searchVal = columns[i].searchValue(cell);
                }else{
                    searchVal = cell?.toString()?.toLowerCase();
                }

                if(searchVal === null || searchVal === undefined)
                    continue;

                if(typeof searchVal === 'string'){
                    searchVal = searchVal.toLowerCase();
                }

                if(searchVal.includes(searchTerm.toLowerCase())){
                    return true;
                }
            }
            return false;
        });
    }

}

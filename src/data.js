export const API_KEY = 'AIzaSyBcvYBYRsDCIVB4H9Yasou4iA42s0pJxvE'

export const value_converter = (value) => {
    if(value>=1000000)
    {
        return Math.floor(value/1000000)+"M";
    }
    else if(value>=1000)
    {
        return Math.floor(value/1000)+"K";
    }
    else{
        return value;
    }
}
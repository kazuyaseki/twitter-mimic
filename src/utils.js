export const queryParamUtils = {
  addQueryParam: (url, params) => {
    url += "?";
    let param_strs = [];
    for(let key in params){
      param_strs.push( key + "=" + params[key] );
    }
    url += param_strs.join("&");
    
    return url;
  },

  twitterQueryParamFactory: (key, secret, url) => {
    return {
      key,
      secret,
      url
    }
  }
}

export const sortUtils = {
  sortTweetsByCreationDate: (a, b) => {
    let aDate = new Date(a.created_at);
    let bDate = new Date(b.created_at);

    if(aDate.getTime() > bDate.getTime())
      return -1;
    else if(bDate.getTime() > aDate.getTime())
      return 1;
    else
      return 0;
  }
}
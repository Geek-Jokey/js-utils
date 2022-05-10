export class Cookie {

  /**
   * 获取cookie
   * @param name 参数名
   * @returns {string | null} 存在返回 cookie值，不存在则返回 null
   */
  getCookie( name ) {
    let arr;
    const reg = new RegExp( '(^| )' + name + '=([^;]*)(;|$)' );

    if ( arr = document.cookie.match( reg ) ) {
      return arr[ 2 ];
    } else {
      return null;
    }
  }

  /**
   * 删除cookie
   * @param name 参数名
   */
  removeCookie( name ) {
    const exp = new Date();
    exp.setTime( exp.getTime() - 1 );
    const cval = this.getCookie( name );
    if ( cval != null )
      document.cookie = name + '=' + cval + ';expires=' + exp.toUTCString();
  }

  /**
   * 设置cookie
   * @param name 参数名
   * @param value cookie值
   */
  setCookie( name, value ) {
    const Days = 30;
    const exp = new Date();
    exp.setTime( exp.getTime() + Days * 24 * 60 * 60 * 1000 );
    document.cookie = name + '=' + value + ';expires=' + exp.toUTCString();
  }
}

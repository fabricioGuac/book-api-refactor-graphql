// use this to decode a token and get the user's information out of it
import decode from 'jwt-decode';

// create a new class to instantiate for a user
class AuthService {
  // get user data
  getProfile() {
    return decode(this.getToken());
  }

  // check if user's logged in
  loggedIn() {
    // Checks if there is a saved token and it's still valid
    const token = this.getToken();
    console.log(token);
    return !!token && !this.isTokenExpired(token); // handwaiving here
  }

  // check if token is expired
  isTokenExpired(token) {
    try {
      const decoded = decode(token);
      const now = Date.now() / 1000;
      console.log(`Token expiration time: ${decoded.exp}`);
      console.log(`Current time: ${now}`);
      if (decoded.exp < now) {
        console.log('EXPIRED');
        return true;
      } else {
        console.log('NOT EXPIRED');
        return false;
      }
    } catch (err) {
      console.log('ERROR DECODING THE TOKEN');
      return false;
    }
  }

  getToken() {
    // Retrieves the user token from localStorage
    const token = localStorage.getItem('id_token');
    console.log(`TOKEN FROM LOCAL STORAGE ${token}`);
    return token
  }

  login(idToken) {
    // Saves user token to localStorage
    localStorage.setItem('id_token', idToken);
    window.location.assign('/');
  }

  logout() {
    // Clear user token and profile data from localStorage
    localStorage.removeItem('id_token');
    // this will reload the page and reset the state of the application
    window.location.assign('/');
  }
}

export default new AuthService();

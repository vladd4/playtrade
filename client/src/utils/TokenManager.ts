class TokenManager {
  private isUserLogged: string | null = null;

  getIsUserLogged() {
    return this.isUserLogged;
  }

  setIsUserLogged(token: string | null) {
    this.isUserLogged = token;
  }
}

export const tokenManager = new TokenManager();

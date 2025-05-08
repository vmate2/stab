import { useDecodeJWT } from "@/composables/decodeJWT";

export class User {
  id?: number;
  uuid?: string;
  username?: string;
  password?: string;
  createdAt?: string;
  modifiedAt?: string;
  config?: Array<any> | null;
  name?: string;
  email?: string;
  phone?: string;
  city?: string;
  school?: string;
  post?: string;
  paidcash?: number;
  accessToken?: string;
  refreshToken?: string;
  value: any;

  constructor(data: Partial<User>) {
    Object.assign(this, data);
  }

  /** Fetch user data using accessToken */
  static async renewAccessToken(refreshToken: string): Promise<string | null> {
    try {
      const response = await $fetch<{ accessToken: string }>("/api/auth/renew", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: { refreshToken },
      });
      return response.accessToken;
    } catch (err) {
      console.error("Error renewing access token:", err);
      return null;
    }
  }

  /** Fetch user data using accessToken, with token renewal if needed */
  static async fetchUser(accessToken: any): Promise<User | null> {
    try {
      console.log('ACCESS TOKEN: ', accessToken.value);
      const token = typeof accessToken === "string" ? accessToken : accessToken.value;
      const { userId } = await useDecodeJWT(token);
      const uuid = userId;

      try {

        console.log("AccessToken in fetchUser: ", token);
        

        const userdata = await $fetch<User>("/api/users/", {
          method: "POST",
          headers: {
            authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
            "origin": "http://localhost:3000/user.ts",
          },
          body: { uuid },
        });

        if (import.meta.client) {
          localStorage.setItem("currentUser", JSON.stringify(userdata));
        }

        return new User(userdata);
      } catch (err: any) {
        // Check if the error is due to token expiration
        if (err.response?.status === 401) {
          console.warn("Access token expired. Attempting to renew...");
          const newAccessToken = await this.renewAccessToken(localStorage.getItem("refreshToken") || "");
          if (newAccessToken) {
            if (import.meta.client) {
              localStorage.setItem("accessToken", newAccessToken);
            }
            return await this.fetchUser(newAccessToken); // Retry with the new token
          }
        }
        throw err;
      }
    } catch (err) {
      console.error("Error fetching user by UUID:", err);
      return null;
    }
  }


  /** Get only necessary fields for the current user */
  static async currentUser(accessToken: string): Promise<Partial<User> | null> {
    try {
      let storedUser = null;

      // Ensure this runs only client-side
      if (import.meta.client) {
        console.log("CLIENT SIDE");
        console.log('ISONCLIENT', import.meta.client);
        
        const userData = localStorage.getItem("currentUser");
        if (userData) {
          try {
            storedUser = JSON.parse(userData);
            
            // Ensure `config` is correctly assigned
            storedUser.config = storedUser.config ?? {};
      
            console.log("Parsed storedUser:", storedUser); // Debugging
            console.log("CONFIG2: ", JSON.stringify(storedUser.config));
          } catch (err) {
            console.error("Error parsing stored user:", err);
          }
        }
      }

      // If user data is not found, fetch it
      if (!storedUser) {
        const user = await User.fetchUser(accessToken);
        console.log("USERVALUE:", user);
        
        if (!user) return null;
        storedUser = user;
        console.log("CONFIG: ", storedUser.config);
        
      }

      // Return only selected fields

      const data = {
        accessToken: accessToken,
        uuid: storedUser.uuid,
        username: storedUser.username,
        config: storedUser.config,
        name: storedUser.name,
        email: storedUser.email,
        phone: storedUser.phone,
        school: storedUser.school,
        city: storedUser.city,
        post: storedUser.post,
        paidcash: storedUser.paidcash,
      }

      console.log('DATA OBJECT: ', data);
      
      console.log("CONFIG2: ", JSON.stringify(storedUser.config));
      

      return {
        accessToken: accessToken,
        uuid: storedUser.uuid,
        username: storedUser.username,
        config: storedUser.config,
        name: storedUser.name,
        email: storedUser.email,
        phone: storedUser.phone,
        school: storedUser.school,
        city: storedUser.city,
        post: storedUser.post,
        paidcash: storedUser.paidcash,
      };

    } catch (err) {
      console.error("Error retrieving current user:", err);
      return null;
    }
  }

  static async getSensitiveUserData(accessToken:string) {

    const user = await this.fetchUser(accessToken);

    return {
      accessToken: accessToken,
      username: user?.username,
      password: user?.password,
      uuid: user?.uuid
    }

  }

  /** Log out user by clearing tokens */
  logOut(): void {
    this.accessToken = undefined;
    this.refreshToken = undefined;
    
    if (import.meta.client) {
      localStorage.removeItem("currentuUser");
    }
    console.log("User logged out and tokens cleared.");
  }
}

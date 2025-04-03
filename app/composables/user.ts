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
  static async fetchUser(accessToken: string): Promise<User | null> {
    try {
      const { userId } = await useDecodeJWT(accessToken); // Decode token to get UUID
      const uuid = userId;
      
      const userdata = await $fetch<User>("/api/users/", {
        method: "POST",
        headers: {
          authorization: `Bearer ${accessToken}`,
          "Content-Type": "application/json",
        },
        body: { uuid },
      });

      if (import.meta.client) { // Ensure this runs only client-side
        localStorage.setItem("currentUser", JSON.stringify(userdata));
      }

      return new User(userdata);
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

type Address = {
    street: string;
    city: string;
    state: string;
    zip: number;
  };
  
  type Post = {
    title: string;
    createdAt: Date;
    createdBy: string;
    postID: number;
    description: string;
    address: Address;
    dates: string[]; // Format: ["YYYY-MM-DD"]
    startTime: string; // Format: "HH:mm"
    endTime: string; // Format: "HH:mm"
    images: string[];
    categories: string[];
    subcategories?: string[]; // Optional if some posts might not have subcategories
  };
  
//   const posts = collection(db, "posts")

// async function addPost(post: Post) {
//     await addDoc(posts, post)
// }

import DB from '../config/db-handler';

const con = DB.getCon();

export const Post = function (this: any, post: any) {
  // TODO based on DBs attributes of posts
}

Post.getPostByCategory = (category: number, result: any) => {
  con.query('CALL getPostByCategoryWithEmployeeInfo(?)',
    [category],
    (err: any, res: any) => {
      if (err) {
        console.log(`Error: ${err}`);
        result(err, null);
      } else {
        let voi = res[0];
        if (Array.isArray(voi) && voi.length > 30) {
          voi = voi.slice(voi.length - 30, voi.length);
        }
        result(null, voi);
      }
    }
  )
}

Post.createPost = (newPost: any, result: any) => {
  // console.log(newPost);
  con.query('CALL createPost(?,?,?,?,?,?,?)',
    [
      newPost.employee_id,
      newPost.channel_id,
      newPost.date_posted,
      newPost.post_title,
      newPost.post_content,
      newPost.post_image,
      newPost.is_flagged
    ],
    (err: any, res: any) => {
      if (err) {
        result(err, null);
      } else {
        result(null, newPost)
      }
    }
  )
};

Post.flagPost = (flag: any, result: any) => {
  con.query('CALL flagPost(?,?)',
    [
      flag.post_id,
      flag.is_flagged
    ],
    (err: any, res: any) => {
      if (err) {
        result(err, null);
      } else {
        result(null, flag);
      }
    }
  )
}

Post.deletePost = (post_id: number, result: any) => {
  con.query('CALL deletePost(?)',
    [
      post_id
    ],
    (err: any, res: any) => {
      if (err)
        result(err, null);
      else
        result(null, post_id);
    }
  )

}
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

Post.getReportedPosts = (category: number, result: any) => {
  con.query('CALL getReportedPosts()',
    [],
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
  con.query('CALL createPostNow(?,?,?,?,?,?)',
    [
      newPost.employee_id,
      newPost.channel_id,
      newPost.post_title,
      newPost.post_content,
      newPost.post_image,
      newPost.num_reports
    ],
    (err: any, res: any) => {
      if (err) {
        result(err, null);
      } else {
        result(null, res[0][0]['LAST_INSERT_ID()'])
      }
    }
  )
};

Post.flagPost = (post: any, result: any) => {
  con.query('CALL reportPost(?)',
    [
      post,
    ],
    (err: any, res: any) => {
      if (err) {
        result(err, null);
      } else {
        result(null, post);
      }
    }
  )
};

Post.unreportPost = (post: any, result: any) => {
  con.query('CALL clearReports(?)',
    [
      post,
    ],
    (err: any, res: any) => {
      if (err) {
        result(err, null);
      } else {
        result(null, post);
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

Post.deletePostAssertUser = (post_id: number, oid: string, result: any) => {
    con.query('CALL deletePostAssertUser(?,?)',
        [
            post_id,
            oid
        ],
        (err: any, res: any) => {
            if (err) {
                result(err, null);
            } else if (res.affectedRows === 0){
                result(new Error("No matching posts"), null);
            } else {
                result(null, post_id);
            }
        }
    )
}
import { Post } from '../models/post';

export default class PostController {
  // tslint:disable-next-line:no-empty
  constructor() {}

  // functions
  findPostByCategory(category: number) {
    if (category === 0) {
      return new Promise((resolve, reject) => {
        Post.getReportedPosts(category, (err: any, res: any) => {
          if (err) {
            reject(err);
          }
          resolve(res);
        });
      });
    } else {
      return new Promise((resolve, reject) => {
        Post.getPostByCategory(category, (err: any, res: any) => {
          if (err) {
            reject(err);
          }
          resolve(res);
        });
      });
    }
  }

  createPost(req: any) {
    const post = {
      employee_id: req.body.employee_id,
      channel_id: req.body.channel_id,
      post_title: null,
      post_content: req.body.post_content,
      post_image: null,
      num_reports: 0,
    };

    return new Promise((resolve, reject) => {
      Post.createPost(post, (err: any, result: any) => {
        if (err) {
          reject(err);
        }
        resolve(result);
      });
    });
  }

  flagPost(req: any) {
    return new Promise((resolve, reject) => {
      Post.flagPost(req.body.post_id, (err: any, result: any) => {
        if (err) {
          reject(err);
        }
        resolve(result);
      });
    });
  }

  unreportPost(req: any) {
    return new Promise((resolve, reject) => {
      Post.unreportPost(req.body.post_id, (err: any, result: any) => {
        if (err) {
          reject(err);
        }
        resolve(result);
      });
    });
  }

  deletePost(req: any, isAdmin: boolean) {
    if (isAdmin) {
      return new Promise((resolve, reject) => {
        Post.deletePost(req.body.post_id, (err: any, result: any) => {
          if (err) reject(err);
          resolve(result);
        });
      });
    } else {
      return new Promise((resolve, reject) => {
        Post.deletePostAssertUser(req.body.post_id, req.authInfo.oid, (err: any, result: any) => {
          if (err) reject(err);
          resolve(result);
        });
      });
    }
  }
}
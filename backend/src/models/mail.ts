import DB from '../config/db-handler';

const con = DB.getCon();

export const Mail = function (this: any, post: any) {
  // TODO based on DBs attributes of posts
}

// Post.getPostByOffice = (category: number, result: any) => {
//   con.query('CALL getPostByCategory(?)',
//     [category],
//     (err: any, res: any) => {
//       if (err) {
//         console.log(`Error: ${err}`);
//         result(err, null);
//       } else {
//         //console.log(res);
//         result(null, res[0]);
//       }
//     }
//   )
// }

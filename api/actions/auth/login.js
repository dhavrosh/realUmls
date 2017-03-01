import passport from 'passport';

export default function login(req, res, next) {
  return new Promise((resolve, reject) => {
    passport.authenticate('login', function authenticate(err, user, info){
      if(err)    return reject(err);
      if(!user) return reject(info);

      req.logIn(user, err => {
        if(err) { reject(err); }
        else {
          resolve(user);
        }
      })
    })(req, res, next);
  });
}
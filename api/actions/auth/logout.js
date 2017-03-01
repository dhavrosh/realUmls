export default function logout(req, res) {
  return new Promise((resolve) => {
    req.logOut();
    req.session.destroy(function (err) {
      resolve(null);
    });
  });
}

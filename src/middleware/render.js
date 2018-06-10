
export default (req, res) => {
  // destruct res locals
  const { data } = res.locals;

  // render markup using pug templating
  res.render('index', {
    title: 'CTM Solution',
    data
  });
};

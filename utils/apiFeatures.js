class APIFeatures {
  constructor(query, queryString) {
    this.query = query;
    this.queryString = queryString;
    this.allCategories = [
      'keychains',
      'Car Hangers',
      'Babies',
      'Occasions',
      'Best Sellers',
      'Crochet',
    ];
  }

  searchAndCategorize() {
    const queryObj = { ...this.queryString };
    const searchWord = queryObj.search;

    //Get the categories from the search word
    const categoriesFromSearch = [];
    if (searchWord !== '')
      this.allCategories.forEach((category) => {
        if (category.toLowerCase().includes(searchWord.toLowerCase()))
          categoriesFromSearch.push(category);
      });

    // Get the categories from the Filter
    let categoriesFromFilter = [];
    if (queryObj.categories !== '')
      categoriesFromFilter = queryObj.categories.split(',');

    // Get the total categories to look up for
    const toLookUpCategories = [
      ...new Set([...categoriesFromFilter, ...categoriesFromSearch]),
    ];
    if (toLookUpCategories.length && searchWord !== '') {
      this.query = this.query.find({
        $or: [
          { name: new RegExp(searchWord, 'i') },
          { categories: { $in: toLookUpCategories } },
        ],
      });
    } else if (toLookUpCategories.length)
      this.query = this.query.find({
        categories: { $in: toLookUpCategories },
      });
    else if (searchWord !== '')
      this.query = this.query.find({
        name: new RegExp(searchWord, 'i'),
      });

    return this;
  }

  filter() {
    const queryObj = { ...this.queryString };
    const excludedFields = ['page', 'sort', 'limit', 'fields'];
    excludedFields.forEach((el) => delete queryObj[el]);

    // 1B) Advanced filtering
    let queryStr = JSON.stringify(queryObj);
    queryStr = queryStr.replace(/\b(gte|gt|lte|lt)\b/g, (match) => `$${match}`);

    this.query = this.query.find(JSON.parse(queryStr));

    return this;
  }

  sort() {
    if (this.queryString.sort) {
      const sortBy = this.queryString.sort.split(',').join(' ');
      this.query = this.query.sort(sortBy);
    } else {
      this.query = this.query.sort('-createdAt');
    }

    return this;
  }

  limitFields() {
    if (this.queryString.fields) {
      const fields = this.queryString.fields.split(',').join(' ');
      this.query = this.query.select(fields);
    } else {
      this.query = this.query.select('-__v');
    }

    return this;
  }

  paginate() {
    const page = this.queryString.page * 1 || 1;
    const limit = this.queryString.limit * 1 || 100;
    const skip = (page - 1) * limit;

    this.query = this.query.skip(skip).limit(limit);

    return this;
  }
}
module.exports = APIFeatures;

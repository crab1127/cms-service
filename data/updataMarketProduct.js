var domain = 'http://dev.gdp.com';

$.ajax({
  url: domain + '/cms/api/market?perPage=100',
})
.done(function(res) {
  if (1 == res.status && res.data && res.data.length) {
    var floor = res.data;
    floor.forEach(function(item, i){
      $.ajax({
        url: domain + '/cms/api/market/' + item._id + '/product?perPage=100',
      })
      .done(function(res1) {
        if (1 == res1.status && res1.data && res1.data.length) {
          var products = res1.data;
          products.forEach(function(item1, i1){
            if (item1.link && item1.link.length > 10 && item1.id) {
              //var id = item1.link.substring(item1.link.lastIndexOf('/') + 1, item1.link.lastIndexOf('.'));
              //item1.id = id
              $.ajax({
                url: 'http://dev.gdp.com/productDetail/productInfo/'+item1.id+'.cf'
              })
              .done(function(res2) {
                if(0 == res2.code) {
                  item1.price = res2.data.price;
                  item1.minOrder = res2.data.minOrder;
                  item1.unit = res2.data.unit;
                  item1.name = res2.data.name;
                  $.ajax({
                    url: '/cms/api/market/product',
                    type: 'POST',
                    data: item1,
                  })
                  .done(function(res) {
                    console.log(res);
                  })

                }
              });


            }
          })
        }
      });
    })
  }
})

$.ajax({
  url: 'http://dev.gdp.com/cms/api/industrial?perPage=50'
})
.done(function(res) {
  if (1 == res.status && res.data && res.data.length) {
    var floor = res.data;
    floor.forEach(function(item, i){
      if (!item.appSortId) {
        item.appSortId = 999
      }
      $.ajax({
        url: 'http://dev.gdp.com/cms/api/industrial',
        type: 'POST',
        data: item,
      })
      .done(function(res) {
        console.log(res);
      })

    })
  }
})

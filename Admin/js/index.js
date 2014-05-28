$(function(){
  Configuration = getConf("conf.json");
  showAll();
  $('#filter_modal').modal({
    keyboard: true,
    show: false
  }).css({
    width: 'auto',
    'margin-left': function () {
      return -($(this).width() / 2);
    }
  });
  $('.change-filter').on('click', function(e){
    e.preventDefault();
    $('#filter_modal').modal('show');
  });
        
  $('.filtering').on('click', function(){
    filter($(".filter-form").serialize());
    $('#filter_modal').modal('hide');
  });
})

function showAll(){
  var res = [];
  var rows = {rows:[]};
  $.ajax({ 
    type: "GET", 
    url: Configuration.url+"?db="+Configuration.database+"&op=search&showid=yes", 
    dataType: 'json',
    success: function(data){
      if(!error(data)){
        $.each(data, function(key, val){
          res.push(val);
        })
        rows.rows = make_new_arr(res);
        var theTemplateScript = Templates.index_view;  
         var theTemplate = Handlebars.compile(theTemplateScript);  
        $('.main-container').append(theTemplate(rows));
      }
      $('td').on('click', function(){
        console.log("tere");
        var dataId = $(this).parent('tr').attr('data-id');
        if($(this).hasClass('delete')){
          deleteRecord(dataId);
        }else{
          redirect("html/data.html?op=search&showid=yes&recids="+dataId);
        }
      });
    }
  });
}

function make_new_arr(block){
  var new_arr = [];
  for(var i = 0; i < block.length; i += 1){
    var b = block[i];
    var new_b = [];
    for (var j = 0; j < 7; j++) {
      if(b[j]==null){
        new_b.push("");}
      else{
        new_b.push(b[j]); 
      }
    }
    if (b[6]!=null){
      new_b[6]="...";
    }
    else{
      new_b[6]="";
    }
    new_arr.push(new_b);
  };
  return new_arr;
}

function filter(params){
  var params = params.replace(/&?[^=&]+=(&|$)/g,'');
  $.ajax({
    type: "GET", 
    url: Configuration.url+"?db="+Configuration.database+"&op=search&showid=yes&"+params,
    dataType: 'json',
    success: function (data) {
      $('.main-container').html('');
      var res = [];
      var rows = {rows: []};
      if(!error(data)){
        $.each(data, function(key, val){
          res.push(val);
        })
        rows.rows = make_new_arr(res);
        var theTemplateScript = Templates.index_view;  
         var theTemplate = Handlebars.compile(theTemplateScript);  
        $('.main-container').append(theTemplate(rows));

        $('td').on('click', function(){
          console.log("tere");
          var dataId = $(this).parent('tr').attr('data-id');
          if($(this).hasClass('delete')){
            deleteRecord(dataId);
          }else{
            redirect("html/data.html?op=search&showid=yes&recids="+dataId);
          }
        });
      }
    }
  });  
}

function deleteRecord(id){
  $.ajax({
    type: 'GET',
    url: Configuration.url+"?db="+Configuration.database+"&op=delete&recids=" + id,
    dataType: 'json',
    success: function(data){
      location.reload();
    }
  });
}
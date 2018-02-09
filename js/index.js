var enumAssetTypes = {
  UNKNOWN: 0,
  PLANT: 1,
  PACKAGE: 2,
}

var assetTypes = [
    {
      state_name: 'UNKNOWN',
      state_enum:  enumAssetTypes.UNKNOWN
    },{
      state_name: 'PLANT',
      state_enum:  enumAssetTypes.PLANT
    },{
      state_name: 'PACKAGE',
      state_enum:  enumAssetTypes.PACKAGE
    }
];

var asset = {
  unique_id: '',
  type: '',
  state: '',
  creation_time: '',
  last_update_time: '',
  transaction_list: [],
};

var assets = [];
var assetTypeName = 'PLANT';

users = [];

// debug event handlers
var addEvent = contractInstance.TestOutputStringEvent();
addEvent.watch(function(error,result){
    if(!error){
        console.log("TestOutputStringEvent ", result, " tx_hash: ", result.transactionHash);
        console.log("args ",result.args);
    }else{
        console.log(error);
    }
});
var addEvent = contractInstance.TestOutputBytes32Event();
addEvent.watch(function(error,result){
    if(!error){
        console.log("TestOutputBytes32Event ", result);
        console.log("args ",result.args);
    }else{
        console.log(error);
    }
});
var addEvent = contractInstance.TestOutputIntEvent();
addEvent.watch(function(error,result){
    if(!error){
        console.log("TestOutputIntEvent ", result);
        console.log("args ",result.args);
    }else{
        console.log(error);
    }
});

function getTrans(){
  var trans_hash = document.getElementById('result_field').value.toString();
  web3.eth.getTransaction(trans_hash.toString(), function(error, result){
       if(!error)
         console.log("result: ",result)
       else
          console.error("error: ",error);
  })
}

function getTransByTxID(trans_hash){
  web3.eth.getTransaction(trans_hash.toString(), function(error, result){
       if(!error){
         console.log("result: ",result);
         var alert_stg = web3.toAscii(result.input);
         alert(alert_stg);
       }else{
          console.error("error: ",error);
      }
  });
}

function ayt(){
  contractInstance.AYT({from: web3.eth.accounts[0]}, function(result) {
  });
}

function writeJSON(){
  writeJSONHandler('/proto/data/plants.txt', plants);
  writeJSONHandler('/proto/data/packages.txt', packages);
}

function readJSON(){
  //var promise = readJSON_Plants();
  //promise.success(function (data) {
  //  alert(data);
  //});
  readJSONHandler('/proto/data/plants.txt', 'plants');
  readJSONHandler('/proto/data/packages.txt', 'packages');
  //drawAssetPage(asset_div);
}

function draw_inventory_stub(){
  plant_page_is_active = false;
  $(plant_page_div).html('');
  $(plant_controls_div).html('');

  package_page_is_active = false;
  $(package_page_div).html('');
  $(package_controls_div).html('');

  var asset_page_is_active = true;
  $(asset_div).html('');

  drawAssetPage();
}

function changeAsset(){
    assetTypeName = $("#selected_asset").val();
}

function newAsset(assetTypeName){
  var new_asset = asset;

  new_asset.unique_id = uuid_hex();
  new_asset.type = assetTypeName;
  new_asset.state = "Init";
  new_asset.creation_time = parseFloat(new Date().getTime() / 1000.0);
  new_asset.last_update_time = new_asset.creation_time;

  assets.push(new_asset);
  drawAssetPage(asset_iv);
}

var asset_div;
var asset_page_is_active = false;
function drawAssetPage(){
  var asset_page_is_active = true;
  $(asset_div).html('');

  if(global_plants && global_plants.length !== 0 && global_packages && global_packages.length !== 0){
    assets.length = 0;
    plants = global_plants;
    packages = global_packages;
    plants.forEach(function(plant){
      assets.push(plant);
    });
    packages.forEach(function(package){
      assets.push(package);
    });
    //console.log(assets);
  }

  var asset_caption = asset_div.appendChild(document.createElement('caption'));
  var asset_title = asset_div.appendChild(document.createElement('span'));
  asset_title.classList.add('h3');
  asset_title.innerHTML = 'Asset Table';

  var asset_table = asset_div.appendChild(document.createElement('table'));
  asset_table.classList.add('table', 'table-bordered', 'table-condensed', 'table-hover', 'table-striped');
  var html = '';
  html += '<tr><th>No.</th><th>ID</th><th>Creation</th><th>Type</th><th>Currrent State</th><th>Last Update</th></tr>'; //'<th>Details</th></tr>';  // Type, ID, creation, state, last update

  var plant_count = 0
  var package_count = 0;
  var count = '';
  if(assets.length !== 0){
    assets.forEach(function(asset){
      if(asset.asset_type === "PLANT"){
        plant_count++;
        count = plant_count;
      }else if(asset.asset_type === "PACKAGE"){
        package_count++;
        count = package_count;
      }
      html += '<tr><td>'+count+'</td><td>'+asset.unique_id+'</td><td>'+convertTimeLocal(asset.creation_time)+'</td><td>'+asset.asset_type+'</td><td>'+asset.state+'</td><td>'+convertTimeLocal(asset.last_update_time)+'</td>';
      //html += '<td><button id="' + asset.unique_id + '" class="btn btn-primary" onclick="provenancePage(\'' + asset.unique_id + '\')"><span class="glyphicon glyphicon-tint"></span>&nbsp;Details</button></td>';
      html += '</tr>'
    });
  }
  html += '</table>';
  $(asset_table).append(html);

  var asset_controls = asset_div.appendChild(document.createElement('div'));
  html = '';
  //html += 'Selected Asset: ' + '<br/><select id="selected_asset" onchange="changeAsset()"'+'>';
  //assetTypes.forEach(function(assetType){
  //    html += '<option value="'+ assetType.state_name + '">'+ assetType.state_name + '</option>';
  //});
  //html += '</select>';

  html += '<a href="#" onclick="drawAssetPage()" class="btn btn-success">Asset Page</a>';
  html += '<a href="#" onclick="plantPage()" class="btn btn-success">Plant Page</a>';
  html += '<a href="#" onclick="packagePage()" class="btn btn-success">Package Page</a>';
  html += '<a href="#" onclick="ayt()" class="btn btn-success">AYT</a>';
  html += '<a href="#" onclick="writeJSON()" class="btn btn-danger">Save Assets</a>';
  html += '<a href="#" onclick="readJSON()" class="btn btn-danger">Load Assets</a>';
  $(asset_controls).append(html);
}

$(document).ready(function() {
  var tag = "main_form_" + new Date().getTime();
  document.getElementById('main').innerHTML = '<div id="' + tag + '" class="container"></div>';
  var element = document.getElementById(tag);

  globalUser = {
    unique_id: '46c1e3ebbbbbfddf8266c76206910bcf',
    role:  0,
    facility:  'anonymous'
  };
  users.push(globalUser);

  app_container_top = element.appendChild(document.createElement('div'));
  asset_div = app_container_top.appendChild(document.createElement('div'));

  drawAssetPage();

});
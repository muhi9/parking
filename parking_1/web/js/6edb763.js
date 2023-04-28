var modal;
(function() {
	var BaseUrl = $(document).attr('baseURI');
    modal = $('.modal');
	$('.showHint').on('click',function(){
         html = '';
         var loadedId;
         /*
         var loadedId = JSON.parse(localStorage.getItem('jstree'));
         if (loadedId['state']['core']['selected'][0] !== undefined)
             loadedId = loadedId['state']['core']['selected'][0];
         else
             loadedId = null;
         if (null === loadedId) {
             swal('Please select node from the tree first.');
             return;
         }
         */

         $.ajax({
            url: urls.ReadNomList,
            data: { loadId: loadedId },
            dataType: 'JSON', //or html or whatever you want
            success:function(result) {
            	createModal(result);

             }

         })

  	})
  	$(document).on('click','.modal .close',function(){
        modal.hide();
  	})

function createModal(data){

    html ='<div class="modal-dialog"><div class="modal-content"><div class="modal-header"><h4>information about Nom types</h4><button type="button" class="close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">×</span></button></div><div class="modal-body"><div class="k-scroll" data-scroll="true" style="height: 400px; overflow: auto;">';
    $.each(data, function(key,value) {
   	html += '<p>'+key+' - '+value.name+' - '+value.desc+'</p>';

   })
    html +='</div></div><div class="modal-footer"></div></div></div>';
    modal.css('background','rgba(0, 0, 0, 0.5)');
    modal.html(html).show();
}

})();


function toggleStatus(id, url) {
  console.log('toggle', id, url);
    sendQeury(url.substr(1))
    .done(function(result){
        if(result!=0){
            if(result['error']){
                alert(result['error']);
                return false;
            }

            $('#id_FBaseBundle_Entity_BaseNoms').DataTable().draw(false);
            if (jQuery('#jsnomtree').length) {
              jQuery('#jsnomtree').jstree(true).refresh(true);
            }
          }
    })
    .fail(function(jqXHR){
        if(jqXHR.status==500 || jqXHR.status==0){
          alert('Error on server side: '+jqXHR.statusText);
          //console.log(jqXHR)
        } else {
          alert('Othe ajax error: '+jqXHR.statusText);
          //console.log(jqXHR)
        }
      return false;
    });


}
Hoot.view.utilities.dataset = function(context)
{
    var hoot_view_utilities_dataset = {};
    
    hoot_view_utilities_dataset.createContent = function(form){

        fieldset = form.append('div')
            .classed('pad1y pad2x keyline-bottom col12', true)
            .append('a')
            .attr('href', '#')
            .text('Add Dataset')
            .classed('dark fr button loud pad2x big _icon plus', true)
            .on('click', function () {
                //importData.classed('hidden', false);
                 Hoot.model.REST('getTranslations', function (d) {
                     if(d.error){
                         context.hoot().view.utilities.errorlog.reportUIError(d.error);
                         return;
                     }
                    context.hoot().control.utilities.dataset.importDataContainer(d);
                 });

            });
        fieldset = form.append('div')
        .attr('id','datasettable')
            .classed('col12 fill-white small strong row10 overflow', true)
            //.call(hoot_view_utilities_dataset.populateDatasets);
            .call(hoot_view_utilities_dataset.populateDatasetsSVG);

    };
    
    hoot_view_utilities_dataset.deleteDataset = function(d,container){
    	d3.event.stopPropagation();
        d3.event.preventDefault();
       
        var warningMsg = d.type =='folder'? 'folder and all data?' : 'dataset?';
        if(!window.confirm("Are you sure you want to remove the selected " + warningMsg)){return;}
        
        var mapId = d.id;//d3.select(this.parentNode).datum().name;
        
	    var parentNode  = container.selectAll("text[lyr-id='" + d.id + "']").node().parentNode;
	    var rectNode = d3.select(parentNode).select('rect'); 
	    var currentFill = rectNode.style('fill');
	    rectNode.style('fill','rgb(255,0,0)');
      
        var datasets2remove = [];
        if(d.type=='folder'){
        	var re = new RegExp('--','g');
        	var folderId = d.id.replace(re,'|');
        	
        	datasets2remove = _.filter(hoot.model.layers.getAvailLayers(),function(f){
        		return f.path.indexOf(folderId)>=0;
        	});
        } else {
        	var availLayers = context.hoot().model.layers.getAvailLayers();
            datasets2remove=_.filter(availLayers,function(n){return n.id==mapId;});
        }
        
        datasets2remove.forEach(function(dataset){
        	var exists = context.hoot().model.layers.getLayers()[dataset.id];
            if(exists){
            	alert('Can not remove the layer in use: ' + dataset.name);
            	rectNode.style('fill',currentFill);
            	return;
            }
            
            //select the rect using lyr-id
            var selNode  = this.selectAll("text[lyr-id='" + dataset.id + "']").node().parentNode;
    	    var selRect = d3.select(selNode).select('rect'); 
    	    var currentFill = selRect.style('fill');
    	    selRect.style('fill','rgb(255,0,0)');
            
    	    d3.json('/hoot-services/osm/api/0.6/map/delete?mapId=' + dataset.name)
        	.header('Content-Type', 'text/plain')
        	.post("", function (error, data) {

        		var exportJobId = data.jobId;

        		var statusUrl = '/hoot-services/job/status/' + exportJobId;
        		var statusTimer = setInterval(function () {
        			d3.json(statusUrl, function (error, result) {
        				if (result.status !== 'running') {
        					Hoot.model.REST.WarningHandler(result);
        					clearInterval(statusTimer);
        					var btnId = result.jobId;
        					selNode.remove();
        					d3.select('.context-menu').style('display', 'none');
        					context.hoot().model.layers.RefreshLayers();
        				}
        			});
        		}, iD.data.hootConfig.JobStatusQueryInterval);
        	});
        },container);
    }
    
    hoot_view_utilities_dataset.exportDataset = function(d,container) {
        d3.event.stopPropagation();
        d3.event.preventDefault();

        var mapid = context.hoot().model.layers.getmapIdByName(d.name);
        Hoot.model.REST('getMapSize', mapid,function (sizeInfo) {
//
            if(sizeInfo.error){
                return;
            }
            var expThreshold = 1*iD.data.hootConfig.export_size_threshold;
            var totalSize = 1*sizeInfo.size_byte;

            if(totalSize > expThreshold)
            {
                var thresholdInMb = Math.floor((1*expThreshold)/1000000);
                var res = window.confirm("Export data size is greater than " + thresholdInMb 
                    +"MB and export may encounter problem." +
                    " Do you wish to continue?");
                if(res === false) {
                    
                    return;
                }
            }

            Hoot.model.REST('getTranslations', function (trans) {
                if(trans.error){
                    context.hoot().view.utilities.errorlog.reportUIError(trans.error);
                    return;
                }
                exportData = context.hoot().control.utilities.dataset.exportDataContainer(d, trans);
            });
        });
    }
    
    hoot_view_utilities_dataset.modifyDataset = function(d) {
        d3.event.stopPropagation();
        d3.event.preventDefault();
    	
    	var data = {};
    	data.inputType=d.type;
    	data.mapid=d.id;
    	
    	modifyName = context.hoot().control.utilities.dataset.modifyNameContainer(d);
    }
    

    hoot_view_utilities_dataset.populateDatasetsSVG = function(container) {
    	var _svg = container.select('svg');
		if(!_svg.empty()){_svg.remove();
		}
		context.hoot().control.utilities.folder.createFolderTree(container);
    }
    
    return hoot_view_utilities_dataset;
}



Hoot.control.utilities = function (context){
	var hoot_control_utilities = {};

	hoot_control_utilities.translation = Hoot.control.utilities.translation(context);
	hoot_control_utilities.basemapdataset = Hoot.control.utilities.basemapdataset(context);
	hoot_control_utilities.dataset = Hoot.control.utilities.dataset(context);
	hoot_control_utilities.wfsdataset = Hoot.control.utilities.wfsdataset(context);
	hoot_control_utilities.reports = Hoot.control.utilities.reports(context);
	hoot_control_utilities.folder = Hoot.control.utilities.folder(context);
	hoot_control_utilities.validation = Hoot.control.utilities.validation(context);
	hoot_control_utilities.filter = Hoot.control.utilities.filter(context);
	hoot_control_utilities.osmdbimport = Hoot.control.utilities.osmdbimport(context);
	
	return hoot_control_utilities;
};
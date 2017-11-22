exports.updateProfile = function (req, res) {
    let result = {},
        files = '',
        fileName = '',
        mongoose = require('mongoose'),
        userProfile = mongoose.model('userAdminProfile'),
        updateVars = req.body.vars,
        sundayStatus,
        mondayStatus,
        tuesdayStatus,
        wednesdayStatus,
        thursdayStatus,
        fridayStatus,
        saturdayStatus;

    //region Config date function
    if(updateVars.sundayAllDay === 'true'){
        sundayStatus = true;
        updateVars.sundayStart = '00:00';
        updateVars.sundayEnd = '00:00';
    }else if(updateVars.sundayClosed  === 'true'){
        sundayStatus = false;
    }else{
        sundayStatus = true;
    }

    if(updateVars.mondayAllDay  === 'true'){
        mondayStatus = true;
        updateVars.mondayStart = '00:00';
        updateVars.mondayEnd = '00:00';
    }else if(updateVars.mondayClosed  === 'true'){
        mondayStatus = false;
    }else{
        mondayStatus = true;
    }

    if(updateVars.tuesdayAllDay  === 'true'){
        tuesdayStatus = true;
        updateVars.tuesdayStart = '00:00';
        updateVars.tuesdayEnd = '00:00';
    }else if(updateVars.tuesdayClosed  === 'true'){
        tuesdayStatus = false;
    }else{
        tuesdayStatus = true;
    }

    if(updateVars.wednesdayAllDay  === 'true'){
        wednesdayStatus = true;
        updateVars.wednesdayStart = '00:00';
        updateVars.wednesdayEnd = '00:00';
    }else if(updateVars.wednesdayClosed  === 'true'){
        wednesdayStatus = false;
    }else{
        wednesdayStatus = true;
    }

    if(updateVars.thursdayAllDay  === 'true'){
        thursdayStatus = true;
        updateVars.thursdayStart = '00:00';
        updateVars.thursdayEnd = '00:00';
    }else if(updateVars.thursdayClosed  === 'true'){
        thursdayStatus = false;
    }else{
        thursdayStatus = true;
    }

    if(updateVars.fridayAllDay  === 'true'){
        fridayStatus = true;
        updateVars.fridayStart = '00:00';
        updateVars.fridayEnd = '00:00';
    }else if(updateVars.fridayClosed  === 'true'){
        fridayStatus = false;
    }else{
        fridayStatus = true;
    }

    if(updateVars.saturdayAllDay  === 'true'){
        saturdayStatus = true;
        updateVars.saturdayStart = '00:00';
        updateVars.saturdayEnd = '00:00';
    }else if(updateVars.saturdayClosed  === 'true'){
        saturdayStatus = false;
    }else{
        saturdayStatus = true;
    }
    //endregion

    //region If file
    if(req.files.file){
        fileName = req.files.file.path.split('logoProfile\\');
        files += fileName[1];

        userProfile.update({
            userID : updateVars.userID
        }, {
            logoPath : files
        }, {
           multi : false
        }, function (data) {
        });
    }
    //endregion

    //region Update info
    userProfile.update({
        userID : updateVars.userID
    }, {
        name : updateVars.name,
        description : updateVars.description,
        pageFacebook : updateVars.pageFacebook,
        webSite : updateVars.webSite,
        zipCode: updateVars.zipCode,
        address : updateVars.address,
        number : updateVars.number,
        complement : updateVars.complement,
        neighborhood : updateVars.neighborhood,
        city : updateVars.city,
        uf : updateVars.uf,
        lat : updateVars.lat,
        long : updateVars.long,
        sunday : {
            status: sundayStatus,
            timeStart : updateVars.sundayStart,
            timeEnd : updateVars.sundayEnd
        },
        monday : {
            status: mondayStatus,
            timeStart : updateVars.mondayStart,
            timeEnd : updateVars.mondayEnd
        },
        tuesday : {
            status : tuesdayStatus ,
            timeStart : updateVars.tuesdayStart,
            timeEnd : updateVars.tuesdayEnd
        },
        wednesday : {
            status : wednesdayStatus,
            timeStart : updateVars.wednesdayStart,
            timeEnd : updateVars.wednesdayEnd
        },
        thursday : {
            status : thursdayStatus,
            timeStart : updateVars.thursdayStart,
            timeEnd : updateVars.thursdayEnd
        },
        friday : {
            status: fridayStatus,
            timeStart : updateVars.fridayStart,
            timeEnd : updateVars.fridayEnd
        },
        saturday : {
            status : saturdayStatus,
            timeStart : updateVars.saturdayStart,
            timeEnd : updateVars.saturdayEnd
        }
    }, {
        multi : false
    }, function (data) {
        res.send(true);
    });
    //endregion
};
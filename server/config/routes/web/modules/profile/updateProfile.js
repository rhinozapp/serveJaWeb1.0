exports.updateProfile = function (req, res) {
    let mongoose = require('mongoose'),
        userAdmin = mongoose.model('userAdmin'),
        cloudinary = require('cloudinary'),
        sundayStatus,
        mondayStatus,
        tuesdayStatus,
        wednesdayStatus,
        thursdayStatus,
        fridayStatus,
        saturdayStatus;

    //region Config date function
    if(req.body.vars.sundayAllDay === 'true'){
        sundayStatus = true;
        req.body.vars.sundayStart = '00:00';
        req.body.vars.sundayEnd = '00:00';
    }else if(req.body.vars.sundayClosed  === 'true'){
        sundayStatus = false;
    }else{
        sundayStatus = true;
    }

    if(req.body.vars.mondayAllDay  === 'true'){
        mondayStatus = true;
        req.body.vars.mondayStart = '00:00';
        req.body.vars.mondayEnd = '00:00';
    }else if(req.body.vars.mondayClosed  === 'true'){
        mondayStatus = false;
    }else{
        mondayStatus = true;
    }

    if(req.body.vars.tuesdayAllDay  === 'true'){
        tuesdayStatus = true;
        req.body.vars.tuesdayStart = '00:00';
        req.body.vars.tuesdayEnd = '00:00';
    }else if(req.body.vars.tuesdayClosed  === 'true'){
        tuesdayStatus = false;
    }else{
        tuesdayStatus = true;
    }

    if(req.body.vars.wednesdayAllDay  === 'true'){
        wednesdayStatus = true;
        req.body.vars.wednesdayStart = '00:00';
        req.body.vars.wednesdayEnd = '00:00';
    }else if(req.body.vars.wednesdayClosed  === 'true'){
        wednesdayStatus = false;
    }else{
        wednesdayStatus = true;
    }

    if(req.body.vars.thursdayAllDay  === 'true'){
        thursdayStatus = true;
        req.body.vars.thursdayStart = '00:00';
        req.body.vars.thursdayEnd = '00:00';
    }else if(req.body.vars.thursdayClosed  === 'true'){
        thursdayStatus = false;
    }else{
        thursdayStatus = true;
    }

    if(req.body.vars.fridayAllDay  === 'true'){
        fridayStatus = true;
        req.body.vars.fridayStart = '00:00';
        req.body.vars.fridayEnd = '00:00';
    }else if(req.body.vars.fridayClosed  === 'true'){
        fridayStatus = false;
    }else{
        fridayStatus = true;
    }

    if(req.body.vars.saturdayAllDay  === 'true'){
        saturdayStatus = true;
        req.body.vars.saturdayStart = '00:00';
        req.body.vars.saturdayEnd = '00:00';
    }else if(req.body.vars.saturdayClosed  === 'true'){
        saturdayStatus = false;
    }else{
        saturdayStatus = true;
    }

    if(!req.body.vars.long){
        req.body.vars.long = req.body.vars.loc.coordinates[0];
    }

    if(!req.body.vars.lat){
        req.body.vars.lat = req.body.vars.loc.coordinates[1];
    }
    //endregion

    //region If file
    if(req.files.file){
        cloudinary.v2.uploader.upload(req.files.file.path, {
            folder : 'logoProfile'
        }, function (error, result) {
            userAdmin.update({
                _id : mongoose.Types.ObjectId(req.body.vars._id)
            }, {
                logoPath : result.secure_url,
                name : req.body.vars.name,
                cnpj : req.body.vars.cnpj,
                description : req.body.vars.description,
                pageFacebook : req.body.vars.pageFacebook,
                pageInstagram : req.body.vars.pageInstagram,
                webSite : req.body.vars.webSite,
                zipCode: req.body.vars.zipCode,
                address : req.body.vars.address,
                number : req.body.vars.number,
                complement : req.body.vars.complement,
                neighborhood : req.body.vars.neighborhood,
                city : req.body.vars.city,
                uf : req.body.vars.uf,
                loc : {
                    'type' : 'Point',
                    coordinates: [req.body.vars.long, req.body.vars.lat]
                },
                statusLoc : req.body.vars.status,
                sunday : {
                    status: sundayStatus,
                    timeStart : req.body.vars.sundayStart,
                    timeEnd : req.body.vars.sundayEnd,
                    sundayMenu : req.body.vars.sundayMenu
                },
                monday : {
                    status: mondayStatus,
                    timeStart : req.body.vars.mondayStart,
                    timeEnd : req.body.vars.mondayEnd,
                    mondayMenu : req.body.vars.mondayMenu
                },
                tuesday : {
                    status : tuesdayStatus ,
                    timeStart : req.body.vars.tuesdayStart,
                    timeEnd : req.body.vars.tuesdayEnd,
                    tuesdayMenu : req.body.vars.tuesdayMenu
                },
                wednesday : {
                    status : wednesdayStatus,
                    timeStart : req.body.vars.wednesdayStart,
                    timeEnd : req.body.vars.wednesdayEnd,
                    wednesdayMenu : req.body.vars.wednesdayMenu
                },
                thursday : {
                    status : thursdayStatus,
                    timeStart : req.body.vars.thursdayStart,
                    timeEnd : req.body.vars.thursdayEnd,
                    thursdayMenu : req.body.vars.thursdayMenu
                },
                friday : {
                    status: fridayStatus,
                    timeStart : req.body.vars.fridayStart,
                    timeEnd : req.body.vars.fridayEnd,
                    fridayMenu : req.body.vars.fridayMenu
                },
                saturday : {
                    status : saturdayStatus,
                    timeStart : req.body.vars.saturdayStart,
                    timeEnd : req.body.vars.saturdayEnd,
                    saturdayMenu : req.body.vars.saturdayMenu
                }
            }, {
                multi : false
            }, function (err, result) {
                if(err){
                    res.json({status : false});
                }else{
                    res.json({status : true});
                }
            });
        });
    }else{
        userAdmin.update({
            _id : mongoose.Types.ObjectId(req.body.vars._id)
        }, {
            name : req.body.vars.name,
            cnpj : req.body.vars.cnpj,
            description : req.body.vars.description,
            pageFacebook : req.body.vars.pageFacebook,
            pageInstagram : req.body.vars.pageInstagram,
            webSite : req.body.vars.webSite,
            zipCode: req.body.vars.zipCode,
            address : req.body.vars.address,
            number : req.body.vars.number,
            complement : req.body.vars.complement,
            neighborhood : req.body.vars.neighborhood,
            city : req.body.vars.city,
            uf : req.body.vars.uf,
            loc : {
                'type' : 'Point',
                coordinates: [req.body.vars.long, req.body.vars.lat]
            },
            statusLoc : req.body.vars.status,
            sunday : {
                status: sundayStatus,
                timeStart : req.body.vars.sundayStart,
                timeEnd : req.body.vars.sundayEnd,
                sundayMenu : req.body.vars.sundayMenu
            },
            monday : {
                status: mondayStatus,
                timeStart : req.body.vars.mondayStart,
                timeEnd : req.body.vars.mondayEnd,
                mondayMenu : req.body.vars.mondayMenu
            },
            tuesday : {
                status : tuesdayStatus ,
                timeStart : req.body.vars.tuesdayStart,
                timeEnd : req.body.vars.tuesdayEnd,
                tuesdayMenu : req.body.vars.tuesdayMenu
            },
            wednesday : {
                status : wednesdayStatus,
                timeStart : req.body.vars.wednesdayStart,
                timeEnd : req.body.vars.wednesdayEnd,
                wednesdayMenu : req.body.vars.wednesdayMenu
            },
            thursday : {
                status : thursdayStatus,
                timeStart : req.body.vars.thursdayStart,
                timeEnd : req.body.vars.thursdayEnd,
                thursdayMenu : req.body.vars.thursdayMenu
            },
            friday : {
                status: fridayStatus,
                timeStart : req.body.vars.fridayStart,
                timeEnd : req.body.vars.fridayEnd,
                fridayMenu : req.body.vars.fridayMenu
            },
            saturday : {
                status : saturdayStatus,
                timeStart : req.body.vars.saturdayStart,
                timeEnd : req.body.vars.saturdayEnd,
                saturdayMenu : req.body.vars.saturdayMenu
            }
        }, {
            multi : false
        }, function (err, data) {
            if(err){
                res.json({status : false});
            }else{
                res.json({status : true});
            }
        });
    }
    //endregion
};
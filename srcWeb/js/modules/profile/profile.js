angular.module('profile', [])
    .controller('profileController', profile);

function profile(profileGet, profileService, zipCodeSearch, Upload, dialogAlert, menuService) {
    var profile = this;
    profile.vars = {};

    profile.functions = {
        core: function() {
            profile.functions.getProfile.get();
            profile.functions.getMenu.getMenu();
        },

        defineVars: function() {
            profile.vars.hours = [
                '00:00',
                '00:30',
                '01:00',
                '01:30',
                '02:00',
                '02:30',
                '03:00',
                '03:30',
                '04:00',
                '04:30',
                '05:00',
                '05:30',
                '06:00',
                '06:30',
                '07:00',
                '07:30',
                '08:00',
                '08:30',
                '09:00',
                '09:30',
                '10:00',
                '10:30',
                '11:00',
                '11:30',
                '12:00',
                '12:30',
                '13:00',
                '13:30',
                '14:00',
                '14:30',
                '15:00',
                '15:30',
                '16:00',
                '16:30',
                '17:00',
                '17:30',
                '18:00',
                '18:30',
                '19:00',
                '19:30',
                '20:00',
                '20:30',
                '21:00',
                '21:30',
                '22:00',
                '22:30',
                '23:00',
                '23:30'
            ];
            profile.vars.listUF = [
                'SP',
                'AC',
                'AL',
                'AM',
                'AP',
                'BA',
                'CE',
                'DF',
                'ES',
                'GO',
                'MA',
                'MG',
                'MS',
                'MT',
                'PA',
                'PB',
                'PE',
                'PI',
                'PR',
                'RJ',
                'RN',
                'RO',
                'RR',
                'RS',
                'SC',
                'SE',
                'TO'
            ];

            if (profile.vars._id) {
                if (profile.vars.sunday.status === false) {
                    profile.vars.sundayClosed = true;
                } else {
                    if (profile.vars.sunday.timeStart === profile.vars.sunday.timeEnd) {
                        profile.vars.sundayAllDay = true;
                    }

                    profile.vars.sundayStart = profile.vars.sunday.timeStart;
                    profile.vars.sundayEnd = profile.vars.sunday.timeEnd;
                }

                if (profile.vars.monday.status === false) {
                    profile.vars.mondayClosed = true;
                } else {
                    if (profile.vars.monday.timeStart === profile.vars.monday.timeEnd) {
                        profile.vars.mondayAllDay = true;
                    }

                    profile.vars.mondayStart = profile.vars.monday.timeStart;
                    profile.vars.mondayEnd = profile.vars.monday.timeEnd;
                }

                if (profile.vars.tuesday.status === false) {
                    profile.vars.tuesdayClosed = true;
                } else {
                    if (profile.vars.tuesday.timeStart === profile.vars.tuesday.timeEnd) {
                        profile.vars.tuesdayAllDay = true;
                    }

                    profile.vars.tuesdayStart = profile.vars.tuesday.timeStart;
                    profile.vars.tuesdayEnd = profile.vars.tuesday.timeEnd;
                }

                if (profile.vars.wednesday.status === false) {
                    profile.vars.wednesdayClosed = true;
                } else {
                    if (profile.vars.wednesday.timeStart === profile.vars.wednesday.timeEnd) {
                        profile.vars.wednesdayAllDay = true;
                    }

                    profile.vars.wednesdayStart = profile.vars.wednesday.timeStart;
                    profile.vars.wednesdayEnd = profile.vars.wednesday.timeEnd;
                }

                if (profile.vars.thursday.status === false) {
                    profile.vars.thursdayClosed = true;
                } else {
                    if (profile.vars.thursday.timeStart === profile.vars.thursday.timeEnd) {
                        profile.vars.thursdayAllDay = true;
                    }

                    profile.vars.thursdayStart = profile.vars.thursday.timeStart;
                    profile.vars.thursdayEnd = profile.vars.thursday.timeEnd;
                }

                if (profile.vars.friday.status === false) {
                    profile.vars.fridayClosed = true;
                } else {
                    if (profile.vars.friday.timeStart === profile.vars.friday.timeEnd) {
                        profile.vars.fridayAllDay = true;
                    }

                    profile.vars.fridayStart = profile.vars.friday.timeStart;
                    profile.vars.fridayEnd = profile.vars.friday.timeEnd;
                }

                if (profile.vars.saturday.status === false) {
                    profile.vars.saturdayClosed = true;
                } else {
                    if (profile.vars.saturday.timeStart === profile.vars.saturday.timeEnd) {
                        profile.vars.saturdayAllDay = true;
                    }

                    profile.vars.saturdayStart = profile.vars.saturday.timeStart;
                    profile.vars.saturdayEnd = profile.vars.saturday.timeEnd;
                }

                profile.vars.sundayMenu = profile.vars.sunday.sundayMenu;
                profile.vars.mondayMenu = profile.vars.monday.mondayMenu;
                profile.vars.tuesdayMenu = profile.vars.tuesday.tuesdayMenu;
                profile.vars.wednesdayMenu = profile.vars.wednesday.wednesdayMenu;
                profile.vars.thursdayMenu = profile.vars.thursday.thursdayMenu;
                profile.vars.fridayMenu = profile.vars.friday.fridayMenu;
                profile.vars.saturdayMenu = profile.vars.saturday.saturdayMenu;
            }
        },

        getMenu: {
            getMenu: function() {
                menuService.getMenu.save({ id: profileGet.id }, profile.functions.getMenu.successGetMenu);
            },

            successGetMenu: function(data) {
                profile.vars.listMenu = data.data;
            }
        },

        getProfile: {
            get: function() {
                profileService.getProfile.save({ id: profileGet.id }, profile.functions.getProfile.success)
            },

            success: function(data) {
                profile.vars = data.data;

                profile.functions.defineVars();
            }
        },

        zipCodeChange: function() {
            profile.vars.zipCode = profile.vars.zipCode.replace('-', '');
            if (profile.vars.zipCode.length >= 8) {
                zipCodeSearch.getDataBack.save(profile.vars, function(data) {
                    profile.vars.address = data.address.logradouro;
                    /*profile.vars.complement = data.address.complemento;*/
                    profile.vars.neighborhood = data.address.bairro;
                    profile.vars.city = data.address.localidade;
                    profile.vars.uf = data.address.uf;
                    profile.vars.lat = data.latlong.lat;
                    profile.vars.long = data.latlong.lng;
                    profile.vars.status = data.latlong.status;
                });
            }
        },

        changeHeaderImg : function () {
            return Upload.upload({
                url: '/web/updateHeaderImgProfile',
                method: 'POST',
                data: {
                    file: profile.vars.headerImgProfile,
                    vars: profile.vars
                }
            });
        },

        upload: function() {
            Upload.upload({
                url: '/web/updateProfile',
                method: 'POST',
                data: {
                    file: profile.vars.files,
                    vars: profile.vars
                }
            }).then(function() {
                dialogAlert.show({
                    title: 'Sucesso!',
                    content: 'Seu perfil foi atualizado com sucesso!',
                    ok: 'OK!'
                });

                profile.functions.core();
            });
        },

        save : function () {
            if(profile.vars.headerImgProfile){
                profile.functions.changeHeaderImg().then(function() {
                    profile.functions.upload();
                });
            }else{
                profile.functions.upload();
            }
        }
    };

    profile.functions.core();
}
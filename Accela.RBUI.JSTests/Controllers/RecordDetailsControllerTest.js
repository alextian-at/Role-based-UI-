/**
 * User: kevin.zhao
 * Date: 12/4/13
 * Time: 1:45 PM
 * To change this template use File | Settings | File Templates.
 */
describe('RecordDetailsController', function () {
    it('should record type array length is 4', function () {

        var CurrentInspector = {
            Inspection: {
                "serviceProviderCode": "BPTDEV",
                "id": 857,
                "scheduleDate": "2013-12-03T08:00:00Z",
                "recordId": {
                    "serviceProviderCode": "BPTDEV",
                    "id": "BPTDEV-DUB13-00000-0003I",
                    "customId": "PMT-201311-18",
                    "trackingId": 241836410
                },
                "inspectorId": "BPTDAILY",
                "requestDate": "2013-12-02T08:00:00Z",
                "submitDate": "2013-12-02T08:00:00Z",
                "scheduleStartAMPM": "AM",
                "scheduleStartTime": "8:09",
                "requestAMPM": "PM",
                "requestTime": "6:10",
                "requiredInspection": "N",
                "requestorPhoneNumber": "18956463214",
                "unitNBR": "A",
                "requestorFirstName": "Accela",
                "requestorMiddleName": "",
                "requestorLastName": "Administrator",
                "scheduleEndAMPM": "AM",
                "scheduleEndTime": "10:11",
                "requestComment": "18956463214",
                "contact": {
                    "fullName": "David Wang",
                    "phoneNumber1": "18956463214"
                },
                "address": {
                    "serviceProviderCode": "BPTDEV",
                    "streetName": "Bishop",
                    "city": "San Ramon",
                    "houseNumberStart": 2010,
                    "primary": "Y",
                    "postalCode": "94583",
                    "status": "A",
                    "id": 712
                },
                "isAutoAssign": false,
                "displayCommentPublicVisible": "N",
                "publicVisible": "Y",
                "status": {
                    "value": "Rescheduled",
                    "text": "Rescheduled"
                },
                "type": {
                    "hasNextInspInAdvance": false,
                    "id": 50,
                    "group": "PMT_MECH_C",
                    "value": "Rough In",
                    "text": "Rough In"
                }
            }
        };

        var RecordDetailsService = {
            ApiRequest: {
                get: function (obj, func) {
                    console.log(func);
                    var data = {
                        "status": 200,
                        "result": [
                            {
                                "serviceProviderCode": "BPTDEV",
                                "id": "BPTDEV-DUB13-00000-0001X",
                                "customId": "PMT13-00012",
                                "trackingId": 287602341,
                                "name": "McDonald Office Complex",
                                "module": "Permits",
                                "type": {
                                    "group": "Permits",
                                    "type": "Commercial",
                                    "subType": "New",
                                    "category": "NA",
                                    "value": "Permits/Commercial/New/NA",
                                    "id": "Permits-Commercial-New-NA",
                                    "text": "Commercial New",
                                    "module": "Permits",
                                    "display": "Commercial New"
                                },
                                "openedDate": "2013-06-12T07:00:00Z",
                                "reportedDate": "2013-06-12T07:00:00Z",
                                "description": "New 7-story commercial building for office space",
                                "isPublicOwned": false,
                                "constructionType": {},
                                "priority": {},
                                "severity": {},
                                "reportedChannel": {
                                    "value": "Call Center",
                                    "text": "Call Center"
                                },
                                "statusReason": {},
                                "statusDate": "2013-12-05T08:00:00Z",
                                "createdBy": "ADMIN",
                                "recordClass": "COMPLETE",
                                "totalJobCost": 0,
                                "undistributedCost": 0,
                                "totalFee": 0,
                                "totalPay": 0,
                                "balance": 0,
                                "isBooking": false,
                                "isInfraction": false,
                                "isMisdemeanor": false,
                                "isOffenseWitnessed": false,
                                "isDefendantSignature": false,
                                "initiatedProduct": "AV360",
                                "jobValue": 2000000,
                                "housingUnits": 0,
                                "numberOfBuildings": 1,
                                "reportedType": {},
                                "status": {
                                    "value": "Finaled",
                                    "text": "Finaled"
                                },
                                "estimatedProductionUnit": 0,
                                "actualProductionUnit": 0
                            }
                        ]
                    };
                    func(data);
                }
            }
        };
        var scope = {},
            ctrl = new RecordDetailsCtrl(scope, RecordDetailsService, CurrentInspector);
        //expect(scope.record).toBeUndefined();
        //$httpBackend.flush();
        expect(scope.typeCategorys.length).toBe(4);
    });
});
import Lucide from "@/components/Base/Lucide";
import events from "@/fakers/events";
import { Tab } from "@/components/Base/Headless";
import Button from "@/components/Base/Button";
import Calendar from "@/components/Calendar";
import { Draggable as FullCalendarDraggable } from "@/components/Base/Calendar";
import { Draggable } from "@fullcalendar/interaction";
import _ from "lodash";
import { Menu } from "@/components/Base/Headless";

function Main() {
  const dragableOptions: Draggable["settings"] = {
    itemSelector: ".event",
    eventData(eventEl) {
      const getDays = () => {
        const days = eventEl.querySelectorAll(".event__days")[0]?.textContent;
        return days ? days : "0";
      };
      return {
        title: eventEl.querySelectorAll(".event__title")[0]?.innerHTML,
        duration: {
          days: parseInt(getDays()),
        },
      };
    },
  };

  return (
    <div className="grid grid-cols-12 gap-y-10 gap-x-6">
      <div className="col-span-12">
        <div className="flex flex-col md:h-10 gap-y-3 md:items-center md:flex-row">
          <div className="text-base font-medium group-[.mode--light]:text-white">
            Food Safety Training Calendar
          </div>
          <div className="flex flex-col sm:flex-row gap-x-3 gap-y-2 md:ml-auto">
            <Button
              variant="primary"
              className="group-[.mode--light]:!bg-white/[0.12] group-[.mode--light]:!text-slate-200 group-[.mode--light]:!border-transparent dark:group-[.mode--light]:!bg-darkmode-900/30 dark:!box"
            >
              <Lucide icon="CopyPlus" className="stroke-[1.3] w-4 h-4 mr-3" />{" "}
              Register for Food Safety Course
            </Button>
          </div>
        </div>
        <div className="mt-3.5 flex flex-col lg:flex-row gap-y-10 gap-x-6">
          <div className="w-full lg:w-[23rem] flex-none">
            <div className="flex flex-col gap-y-7">
              <div className="flex flex-col p-5 box box--stacked">
                <div className="pb-5 mb-5 font-medium border-b border-dashed border-slate-300/70 text-[0.94rem]">
                  Upcoming Food Safety Courses
                </div>
                <FullCalendarDraggable
                  id="calendar-events"
                  options={dragableOptions}
                >
                  <div className="flex flex-col gap-y-6">
                    {_.take(events.fakeEvents(), 5).map((faker, fakerKey) => {
                      // Food safety training-specific event types
                      const eventTypes = [
                        "HACCP Certification",
                        "Food Handler Training",
                        "Allergen Management",
                        "Sanitation Workshop",
                        "Food Safety Audit Prep"
                      ];
                      const eventType = eventTypes[fakerKey % eventTypes.length];
                      
                      // Training-specific time formats
                      const duration = _.random(1, 3);
                      const timeFormat = fakerKey % 2 === 0 ? 
                        `${duration} Day${duration > 1 ? 's' : ''}` : 
                        `${_.random(3, 8)} Hour${_.random(3, 8) > 1 ? 's' : ''}`;
                      
                      // Food safety training titles
                      const trainingTitles = [
                        "ServSafe Food Manager Certification",
                        "Food Handling & Cross-Contamination",
                        "Temperature Control & Monitoring",
                        "Foodborne Illness Prevention",
                        "Facility Sanitation Standards"
                      ];
                      const trainingTitle = trainingTitles[fakerKey % trainingTitles.length];

                      return (
                        <div
                          className="relative flex items-center gap-3.5 p-5 cursor-move event box box--stacked"
                          key={fakerKey}
                        >
                          <div>
                            <div className="w-[4.5rem] h-[4.5rem] overflow-hidden rounded-2xl image-fit border-[3px] border-slate-200/70">
                              <img
                                alt="Food Safety Training"
                                src={faker.image}
                              />
                            </div>
                          </div>
                          <div>
                            <div className="font-medium text-primary max-w-[7rem] md:max-w-[12rem] truncate event__title">
                              {trainingTitle}
                            </div>
                            <div className="mt-1 leading-relaxed text-slate-500 max-w-[7rem] md:max-w-[12rem] truncate">
                              {eventType} • { "Chef Michael"}
                            </div>
                            <div className="mt-1 text-slate-500">
                              <span className="event__days">
                                {duration}
                              </span>{" "}
                              {timeFormat} <span className="mx-1">•</span> {"09:00 AM"}
                            </div>
                          </div>
                          <Menu className="absolute inset-y-0 right-0 w-5 h-5 my-auto mr-5 group-[.right]:-ml-8 group-[.right]:left-0">
                            <Menu.Button className="w-5 h-5 text-slate-500">
                              <Lucide
                                icon="MoreVertical"
                                className="w-5 h-5 stroke-slate-400/70 fill-slate-400/70"
                              />
                            </Menu.Button>
                            <Menu.Items className="w-40">
                              <Menu.Item>
                                <Lucide icon="Calendar" className="w-4 h-4 mr-2" />{" "}
                                Add to My Calendar
                              </Menu.Item>
                              <Menu.Item>
                                <Lucide icon="FileText" className="w-4 h-4 mr-2" />{" "}
                                View Course Details
                              </Menu.Item>
                              <Menu.Item>
                                <Lucide icon="UserCheck" className="w-4 h-4 mr-2" />{" "}
                                Register Now
                              </Menu.Item>
                            </Menu.Items>
                          </Menu>
                        </div>
                      );
                    })}
                    <div
                      className="hidden p-3 text-center text-slate-500"
                      id="calendar-no-events"
                    >
                      No food safety training sessions scheduled
                    </div>
                  </div>
                </FullCalendarDraggable>
              </div>
              
              {/* Required Certifications Section */}
              <div className="flex flex-col p-5 box box--stacked">
                <div className="pb-5 mb-5 font-medium border-b border-dashed border-slate-300/70 text-[0.94rem]">
                  Required Food Safety Certifications
                </div>
                <div className="flex flex-col gap-3">
                  <div className="flex items-center p-3 border rounded-md">
                    <div className="flex-shrink-0 mr-3">
                      <div className="w-10 h-10 bg-success/20 flex items-center justify-center rounded-full">
                        <Lucide icon="CheckCircle" className="w-5 h-5 text-success" />
                      </div>
                    </div>
                    <div>
                      <div className="font-medium">ServSafe Food Handler</div>
                      <div className="text-xs text-slate-500">Valid until: December 15, 2024</div>
                    </div>
                  </div>
                  <div className="flex items-center p-3 border rounded-md">
                    <div className="flex-shrink-0 mr-3">
                      <div className="w-10 h-10 bg-warning/20 flex items-center justify-center rounded-full">
                        <Lucide icon="AlertTriangle" className="w-5 h-5 text-warning" />
                      </div>
                    </div>
                    <div>
                      <div className="font-medium">HACCP Principles</div>
                      <div className="text-xs text-warning">Expires in 30 days</div>
                    </div>
                  </div>
                  <div className="flex items-center p-3 border rounded-md">
                    <div className="flex-shrink-0 mr-3">
                      <div className="w-10 h-10 bg-danger/20 flex items-center justify-center rounded-full">
                        <Lucide icon="XCircle" className="w-5 h-5 text-danger" />
                      </div>
                    </div>
                    <div>
                      <div className="font-medium">Allergen Awareness</div>
                      <div className="text-xs text-danger">Certification required</div>
                    </div>
                  </div>
                </div>
              </div>
            
              {/* Food Safety Training Filters */}
              <div className="flex flex-col p-5 box box--stacked">
                <div className="pb-5 mb-5 font-medium border-b border-dashed border-slate-300/70 text-[0.94rem]">
                  Filter Training Sessions
                </div>
                <div className="flex flex-col gap-3">
                  <div className="flex items-center gap-2">
                    <input type="checkbox" id="filter-haccp" className="form-check-input" />
                    <label htmlFor="filter-haccp" className="cursor-pointer">HACCP Certification</label>
                  </div>
                  <div className="flex items-center gap-2">
                    <input type="checkbox" id="filter-servsafe" className="form-check-input" />
                    <label htmlFor="filter-servsafe" className="cursor-pointer">ServSafe Courses</label>
                  </div>
                  <div className="flex items-center gap-2">
                    <input type="checkbox" id="filter-allergen" className="form-check-input" />
                    <label htmlFor="filter-allergen" className="cursor-pointer">Allergen Management</label>
                  </div>
                  <div className="flex items-center gap-2">
                    <input type="checkbox" id="filter-sanitation" className="form-check-input" />
                    <label htmlFor="filter-sanitation" className="cursor-pointer">Sanitation & Hygiene</label>
                  </div>
                  <div className="mt-3 pt-3 border-t border-dashed border-slate-300/70">
                    <div className="font-medium mb-2 text-sm">Course Type</div>
                    <div className="flex items-center gap-2">
                      <input type="checkbox" id="filter-initial" className="form-check-input" />
                      <label htmlFor="filter-initial" className="cursor-pointer">Initial Certification</label>
                    </div>
                    <div className="flex items-center gap-2">
                      <input type="checkbox" id="filter-recertification" className="form-check-input" />
                      <label htmlFor="filter-recertification" className="cursor-pointer">Recertification</label>
                    </div>
                    <div className="flex items-center gap-2">
                      <input type="checkbox" id="filter-advanced" className="form-check-input" />
                      <label htmlFor="filter-advanced" className="cursor-pointer">Advanced Training</label>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="flex flex-col w-full gap-y-7">
            <div className="flex flex-col p-5 box box--stacked">
              <div className="pb-5 mb-5 font-medium border-b border-dashed border-slate-300/70 text-[0.94rem]">
                Food Safety Training Schedule
              </div>
              <Calendar />
            </div>
            
            {/* Food Safety Calendar Legend */}
            <div className="flex flex-col p-5 box box--stacked">
              <div className="pb-3 mb-3 font-medium border-b border-dashed border-slate-300/70 text-[0.94rem]">
                Calendar Legend
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 rounded-full bg-primary"></div>
                  <span>Your Registered Courses</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 rounded-full bg-success"></div>
                  <span>Open Registration</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 rounded-full bg-warning"></div>
                  <span>Renewal Required Soon</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 rounded-full bg-danger"></div>
                  <span>Mandatory Compliance Training</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 rounded-full bg-slate-400"></div>
                  <span>Course Full/Registration Closed</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 rounded-full bg-primary/30 border border-primary"></div>
                  <span>Food Safety Examination</span>
                </div>
              </div>
            </div>
            
            {/* Food Safety Compliance Stats */}
            <div className="flex flex-col p-5 box box--stacked">
              <div className="pb-3 mb-3 font-medium border-b border-dashed border-slate-300/70 text-[0.94rem]">
                Compliance Status
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                <div className="p-4 border rounded-md bg-slate-50">
                  <div className="text-center">
                    <div className="text-3xl font-medium text-success">85%</div>
                    <div className="text-sm text-slate-600 mt-1">Team Certification Rate</div>
                  </div>
                  <div className="mt-3 h-2 bg-slate-200 rounded-full overflow-hidden">
                    <div className="h-full bg-success" style={{ width: "85%" }}></div>
                  </div>
                </div>
                <div className="p-4 border rounded-md bg-slate-50">
                  <div className="text-center">
                    <div className="text-3xl font-medium text-primary">4</div>
                    <div className="text-sm text-slate-600 mt-1">Your Active Certifications</div>
                  </div>
                  <div className="mt-3 flex items-center justify-center">
                    <div className="text-xs text-primary">HACCP, ServSafe, ISO 22000, FSSC</div>
                  </div>
                </div>
                <div className="p-4 border rounded-md bg-slate-50">
                  <div className="text-center">
                    <div className="text-3xl font-medium text-warning">2</div>
                    <div className="text-sm text-slate-600 mt-1">Upcoming Renewals</div>
                  </div>
                  <div className="mt-3 flex justify-center">
                    <Button size="sm" variant="outline-warning">View Details</Button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Main;

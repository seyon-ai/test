// Adapter contract: send(job), capture(enquiry), request(appointment).
// No network call is performed by these mock implementations.
export const mockMessaging={send(job){if(job.failSimulation)throw new Error('Simulated provider failure');return {id:'sim-'+job.id,mode:'simulation'};}};
export const mockCRM={capture(enquiry){return {id:enquiry.id,mode:'simulation'};}};
export const mockScheduling={request(appointment){return {id:appointment.id,status:'request-only',availabilityVerified:false};}};
export const mockEmail=mockMessaging;

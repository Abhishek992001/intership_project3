import mongoose, { Document, Schema, Model } from "mongoose";

// Event Registration Model
interface IEventRegistration extends Document {
    volunteer: mongoose.Schema.Types.ObjectId;
    event: mongoose.Schema.Types.ObjectId;
  }
  
  const eventRegistrationSchema = new Schema<IEventRegistration>(
    {
      volunteer: { type: Schema.Types.ObjectId, ref: "User", required: true },
      event: { type: Schema.Types.ObjectId, ref: "Event", required: true },
    },
    { timestamps: true }
  );
  
  const EventRegistration: Model<IEventRegistration> = mongoose.model<IEventRegistration>("EventRegistration", eventRegistrationSchema);
  
  export default EventRegistration;
const NewApplicationForm6 = () => {
  return (
    <div className="flex flex-col gap-y-10 justify-center h-full items-center w-full bg-white">
      <div className="flex flex-col gap-y-6 w-[85%]">
        <h1 className="text-4xl font-bold text-black w-full font-radios">
          Applicant: Read the following statement, then sign and date
          Application Form
        </h1>
        <div className="flex flex-col gap-y-3 w-full">
          <p className="text-gray-600 font-radios text-[15px]">
            I understand that in order to qualify for this position as an
            interstate commercial driver I must submit the employment controlled
            substance test, and must test negative before an offer of employment
            can be processed and is in accordance with US DOT Federal Motor
            Carrier Safety Regulations Part 391.
          </p>
          <p className="text-gray-600 font-radios text-[15px]">
            I authorize Insomnia 888 Corp to make any such inquiries and
            investigations of my driving and past employment background,
            personal, financial and/or medical history, I hereby release state
            agencies, employers, schools, health care providers and/or any other
            person from all liability in connection to their responding to any
            and all inquiries from Insomnia 888 Corp and the subsequent release
            information to verify the accuracy of this application.
          </p>
          <p className="text-gray-600 font-radios text-[15px]">
            I understand that in the event of my employment by Insomnia 888 Corp
            any false or misstatements given in my application or Interview(s)
            may result in my discharge. I also understand that I have to abide
            by all rules and regulations of Insomnia 888 Corp.
          </p>
          <p className="text-gray-600 font-radios text-[15px]">
            This certifies that this application was completed by me, and that
            all entries on it and Information in it is complete to the best of
            my knowledge.
          </p>
        </div>
        <div className="flex flex-col gap-y-5 w-full"></div>
      </div>
    </div>
  );
};

export default NewApplicationForm6;

// "use client";

// import {
//   CreateProjectKeyResponse,
//   LiveClient,
//   LiveTranscriptionEvents,
//   createClient,
// } from "@deepgram/sdk";
// import { useState, useEffect, useCallback } from "react";
// import { useQueue } from "@uidotdev/usehooks";
// import Dg from "./dg.svg";
// import Recording from "./recording.svg";
// import Image from "next/image";

// export default function Microphone() {
//   const { add, remove, first, size, queue } = useQueue<any>([]);
//   const [apiKey, setApiKey] = useState<CreateProjectKeyResponse | null>();
//   const [connection, setConnection] = useState<LiveClient | null>();
//   const [isListening, setListening] = useState(false);
//   const [isLoadingKey, setLoadingKey] = useState(true);
//   const [isLoading, setLoading] = useState(true);
//   const [isProcessing, setProcessing] = useState(false);
//   const [micOpen, setMicOpen] = useState(false);
//   const [microphone, setMicrophone] = useState<MediaRecorder | null>();
//   const [userMedia, setUserMedia] = useState<MediaStream | null>();
//   const [caption, setCaption] = useState<string | null>();

//   const toggleMicrophone = useCallback(async () => {
//     if (microphone && userMedia) {
//       setUserMedia(null);
//       setMicrophone(null);

//       microphone.stop();
//     } else {
//       const userMedia = await navigator.mediaDevices.getUserMedia({
//         audio: true,
//       });

//       const microphone = new MediaRecorder(userMedia);
//       microphone.start(500);

//       microphone.onstart = () => {
//         setMicOpen(true);
//       };

//       microphone.onstop = () => {
//         setMicOpen(false);
//       };

//       microphone.ondataavailable = (e) => {
//         add(e.data);
//       };

//       setUserMedia(userMedia);
//       setMicrophone(microphone);
//     }
//   }, [add, microphone, userMedia]);

//   useEffect(() => {
//     if (!apiKey) {
//       console.log("getting a new api key");
//       fetch("/api", { cache: "no-store" })
//         .then((res) => res.json())
//         .then((object) => {
//           if (!("key" in object)) throw new Error("No api key returned");

//           setApiKey(object);
//           setLoadingKey(false);
//         })
//         .catch((e) => {
//           console.error(e);
//         });
//     }
//   }, [apiKey]);

//   useEffect(() => {
//     if (apiKey && "key" in apiKey) {
//       console.log("connecting to deepgram");
//       const deepgram = createClient(apiKey?.key ?? "");
//       const connection = deepgram.listen.live({
//         model: "nova",
//         interim_results: true,
//         smart_format: true,
//       });

//       connection.on(LiveTranscriptionEvents.Open, () => {
//         console.log("connection established");
//         setListening(true);
//       });

//       connection.on(LiveTranscriptionEvents.Close, () => {
//         console.log("connection closed");
//         setListening(false);
//         setApiKey(null);
//         setConnection(null);
//       });

//       connection.on(LiveTranscriptionEvents.Transcript, (data) => {
//         const words = data.channel.alternatives[0].words;
//         const caption = words
//           .map((word: any) => word.punctuated_word ?? word.word)
//           .join(" ");
//         if (caption !== "") {
//           setCaption(caption);
//         }
//       });

//       setConnection(connection);
//       setLoading(false);
//     }
//   }, [apiKey]);

//   useEffect(() => {
//     const processQueue = async () => {
//       if (size > 0 && !isProcessing) {
//         setProcessing(true);

//         if (isListening) {
//           const blob = first;
//           connection?.send(blob);
//           remove();
//         }

//         const waiting = setTimeout(() => {
//           clearTimeout(waiting);
//           setProcessing(false);
//         }, 250);
//       }
//     };

//     processQueue();
//   }, [connection, queue, remove, first, size, isProcessing, isListening]);

//   if (isLoadingKey)
//     return (
//       <span className="w-full text-center">Loading temporary API key...</span>
//     );
//   if (isLoading)
//     return <span className="w-full text-center">Loading the app...</span>;

//   return (
//     <div className="w-full relative">
//       <div className="mt-10 flex flex-col align-middle items-center">
//         {!!userMedia && !!microphone && micOpen ? (
//           <Image
//             src="/speak.png"
//             width="168"
//             height="129"
//             alt="Deepgram Logo"
//             priority
//           />
//         ) : (
//           <Image
//             src="/click.png"
//             width="168"
//             height="129"
//             alt="Deepgram Logo"
//             priority
//           />
//         )}

//         <button className="w-24 h-24" onClick={() => toggleMicrophone()}>
//           <Recording
//             width="96"
//             height="96"
//             className={
//               `cursor-pointer` + !!userMedia && !!microphone && micOpen
//                 ? "fill-red-400 drop-shadow-glowRed"
//                 : "fill-gray-600"
//             }
//           />
//         </button>
//         <div className="mt-20 p-6 text-xl text-center">
//           {caption && micOpen
//             ? caption
//             : "** Realtime transcription by Deepgram **"}
//         </div>
//       </div>
//       <div
//         className="z-20 text-white flex shrink-0 grow-0 justify-around items-center 
//                   fixed bottom-0 right-5 rounded-lg mr-1 mb-5 lg:mr-5 lg:mb-5 xl:mr-10 xl:mb-10 gap-5"
//       >
//         <span className="text-sm text-gray-400">
//           {isListening
//             ? "Deepgram connection open!"
//             : "Deepgram is connecting..."}
//         </span>
//         <Dg
//           width="30"
//           height="30"
//           className={
//             isListening ? "fill-white drop-shadow-glowBlue" : "fill-gray-600"
//           }
//         />
//       </div>
//     </div>
//   );
// }



"use client";

// Importing necessary hooks and utilities from React and external libraries.
import {
  CreateProjectKeyResponse,
  LiveClient,
  LiveTranscriptionEvents,
  createClient,
} from "@deepgram/sdk";
import { useState, useEffect, useCallback } from "react";
import { useQueue } from "@uidotdev/usehooks"; // A custom hook for queue management.
import Dg from "./dg.svg"; // Deepgram logo for UI.
import Recording from "./recording.svg"; // Recording indicator icon.
import Image from "next/image"; // Next.js optimized image component.

// The Microphone functional component.
export default function Microphone() {
  // State management hooks for various functionalities such as managing the audio capture, connection status, API key, and transcriptions.
  const { add, remove, first, size, queue } = useQueue<any>([]);
  const [apiKey, setApiKey] = useState<CreateProjectKeyResponse | null>();
  const [connection, setConnection] = useState<LiveClient | null>();
  const [isListening, setListening] = useState(false); // Indicates if the app is currently listening for audio.
  const [isLoadingKey, setLoadingKey] = useState(true); // Manages the loading state of the API key.
  const [isLoading, setLoading] = useState(true); // General loading state, presumably for the overall connection setup.
  const [isProcessing, setProcessing] = useState(false); // Indicates if audio chunks are currently being processed.
  const [micOpen, setMicOpen] = useState(false); // Indicates if the microphone is active and capturing audio.
  const [microphone, setMicrophone] = useState<MediaRecorder | null>(); // The MediaRecorder instance for audio capture.
  const [userMedia, setUserMedia] = useState<MediaStream | null>(); // The user's audio stream.
  const [caption, setCaption] = useState<string | null>(); // The transcription text received from Deepgram.
  const [websocket, setWebsocket] = useState<WebSocket | null>(null); // New line: WebSocket state
  const [analysisResult, setAnalysisResult] = useState(null);



//This function sends the transcribed text to the FastAPI backend and updates the analysisResult state with the response.
  async function analyzeTranscript(transcriptText) {
  console.log("analyzing transcript entered react")
  try {
    const response = await fetch('http://localhost:8000/analyze-text/', {
      method: 'POST',
      headers: {'Content-Type': 'application/json'},
      body: JSON.stringify({ text: transcriptText }),
    });
    if (!response.ok) throw new Error('Failed to analyze transcript');
    const data = await response.json();
    setAnalysisResult(data.interview_question || 'No questions detected');
  } catch (error) {
    console.error('Error analyzing transcript:', error);
  }
}

  // Toggles the microphone state: starts or stops audio capture.
  const toggleMicrophone = useCallback(async () => {
    if (microphone && userMedia) {
      // If the microphone is currently capturing audio, stop it.
      setUserMedia(null);
      setMicrophone(null);
      microphone.stop();
    } else {
      // If the microphone is not capturing, start it.
      const userMedia = await navigator.mediaDevices.getUserMedia({
        audio: true,
      });
      const microphone = new MediaRecorder(userMedia);
      microphone.start(500); // Start capturing audio with 500ms chunks.

      // Event listeners for the MediaRecorder.
      microphone.onstart = () => setMicOpen(true);
      microphone.onstop = () => setMicOpen(false);
      microphone.ondataavailable = (e) => add(e.data); // Add audio chunks to the queue.

      setUserMedia(userMedia);
      setMicrophone(microphone);
    }
  }, [add, microphone, userMedia]);

  // Fetches the API key from a server endpoint.
  useEffect(() => {
    if (!apiKey) {
      console.log("getting a new api key");
      fetch("/api", { cache: "no-store" })
        .then((res) => res.json())
        .then((object) => {
          if (!("key" in object)) throw new Error("No api key returned");
          setApiKey(object);
          setLoadingKey(false);
        })
        .catch((e) => {
          console.error(e);
        });
    }
  }, [apiKey]);

  // Establishes the WebSocket connection to Deepgram for live transcription.
  useEffect(() => {
    if (apiKey && "key" in apiKey) {
      console.log("connecting to deepgram");
      const deepgram = createClient(apiKey?.key ?? "");
      const connection = deepgram.listen.live({
        model: "nova",
        interim_results: true,
        smart_format: true,
      });

      // WebSocket event listeners for open, close, and receiving transcripts.
      connection.on(LiveTranscriptionEvents.Open, () => {
        console.log("connection established");
        setListening(true);
      });
      connection.on(LiveTranscriptionEvents.Close, () => {
        console.log("connection closed");
        setListening(false);
        setApiKey(null);
        setConnection(null);
      });
      connection.on(LiveTranscriptionEvents.Transcript, (data) => {
        // Processing transcription data.
        const words = data.channel.alternatives[0].words;
        const caption = words.map((word: any) => word.punctuated_word ?? word.word).join(" ");
        if (caption !== "") {
          setCaption(caption);
        }
      });

      setConnection(connection);
      setLoading(false);
  
      // New WebSocket connection to the FastAPI backend
      const fastApiWebSocket = new WebSocket('ws://localhost:8000/listen'); // New line: Establish WebSocket connection to FastAPI
  
      fastApiWebSocket.onopen = () => { // New line: WebSocket open handler for FastAPI
        console.log('FastAPI WebSocket connection established');
        // You might want to update some state to reflect this connection status
      };
  
      fastApiWebSocket.onmessage = (event) => { // New line: WebSocket message handler for FastAPI
        const receivedTranscript = event.data;
        console.log('Received transcript from FastAPI:', receivedTranscript);
        setCaption(receivedTranscript); // Update the caption state with the received transcript
        analyzeTranscript(receivedTranscript); // Analyze the received transcript
      };
  
      fastApiWebSocket.onerror = (error) => { // New line: WebSocket error handler for FastAPI
        console.error('FastAPI WebSocket error:', error);
      };
  
      fastApiWebSocket.onclose = () => { // New line: WebSocket close handler for FastAPI
        console.log('FastAPI WebSocket connection closed');
        // Update any relevant state to reflect the closed status
      };
          // New lines: Cleanup function for the new WebSocket connection
       return () => {
    // Check if the fastApiWebSocket connection is open and needs to be closed
    if (fastApiWebSocket && fastApiWebSocket.readyState === WebSocket.OPEN) {
      fastApiWebSocket.close();
    }
  };

  }
}, [apiKey, analyzeTranscript]);

  

  // Processes the audio queue, sending chunks to Deepgram for transcription.
  useEffect(() => {
    const processQueue = async () => {
      if (size > 0 && !isProcessing) {
        setProcessing(true);

        if (isListening) {
          const blob = first; // Get the first audio chunk from the queue.
          connection?.send(blob); // Send it to Deepgram.
          remove(); // Remove the chunk from the queue.
        }

        // Wait a bit before marking the processing as done.
        const waiting = setTimeout(() => {
          clearTimeout(waiting);
          setProcessing(false);
        }, 250);
      }
    };

    processQueue();
  }, [connection, queue, remove, first, size, isProcessing, isListening]);

  // Loading indicators for fetching the API key and setting up the app.
  if (isLoadingKey) return <span className="w-full text-center">Loading temporary API key...</span>;
  if (isLoading) return <span className="w-full text-center">Loading the app...</span>;

  // The component's UI, including the microphone toggle and transcription display.
  return (
    <div className="w-full relative">
      <div>{analysisResult}</div>
      <div className="mt-10 flex flex-col align-middle items-center">
        {/* Display different images based on whether the microphone is active. */}
        {!!userMedia && !!microphone && micOpen ? (
          <Image src="/speak.png" width="168" height="129" alt="Speaking Indicator" priority />
        ) : (
          <Image src="/click.png" width="168" height="129" alt="Microphone Off Indicator" priority />
        )}

        {/* Microphone toggle button */}
        <button className="w-24 h-24" onClick={() => toggleMicrophone()}>
          <Recording width="96" height="96" className={`cursor-pointer ${!!userMedia && !!microphone && micOpen ? "fill-red-400 drop-shadow-glowRed" : "fill-gray-600"}`} />
        </button>

        {/* Display the latest caption or a default message. */}
        <div className="mt-20 p-6 text-xl text-center">
          {caption && micOpen ? caption : "** Realtime transcription by Deepgram **"}
        </div>
      </div>

      {/* Indicator for the Deepgram connection status. */}
      <div className="z-20 text-white flex shrink-0 grow-0 justify-around items-center fixed bottom-0 right-5 rounded-lg mr-1 mb-5 lg:mr-5 lg:mb-5 xl:mr-10 xl:mb-10 gap-5">
        <span className="text-sm text-gray-400">{isListening ? "Deepgram connection open!" : "Deepgram is connecting..."}</span>
        <Dg width="30" height="30" className={isListening ? "fill-white drop-shadow-glowBlue" : "fill-gray-600"} />
      </div>
    </div>
  );
}

